<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Payment;
use App\Models\Course;
use App\Models\Enrollment;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class PaymentController extends Controller
{
    public function initiate(Request $request)
    {
        Log::info('Payment initiation started', $request->all());
        
        $request->validate([
            'course_id' => 'required|exists:courses,id'
        ]);

        $user = $request->user();
        $course = Course::findOrFail($request->course_id);

        // check if already enrolled
        $alreadyEnrolled = Enrollment::where('user_id', $user->id)
            ->where('course_id', $course->id)
            ->exists();

        if ($alreadyEnrolled) {
            return response()->json(['message' => 'Already enrolled'], 400);
        }

        // Create pending payment record
        $payment = Payment::create([
            'user_id' => $user->id,
            'course_id' => $course->id,
            'amount' => $course->price,
            'status' => 'pending'
        ]);

        try {
            // Testing with RAW key string
            $apiKey = config('services.hesabpay.api_key');
            
            /*
            if (base64_encode(base64_decode($apiKey, true)) === $apiKey) {
                $apiKey = base64_decode($apiKey);
            }
            */
            
            Log::info('Initiating HesabPay Request', [
                'merchant_id' => config('services.hesabpay.merchant_id'),
                'key_preview' => substr($apiKey, 0, 8) . '...'
            ]);

            $response = Http::withHeaders([
                'Authorization' => "API-KEY {$apiKey}",
                'Content-Type' => 'application/json',
                'Accept' => 'application/json',
            ])->post('https://api.hesab.com/api/v1/payment/create-session', [
                'amount' => (string)$course->price,
                'currency' => 'AFN',
                'description' => "Enrollment for {$course->title}",
                'items' => [
                    [
                        'id' => (string)$course->id,
                        'name' => $course->title,
                        'price' => (string)$course->price,
                        'quantity' => 1
                    ]
                ],
                'success_url' => url("/api/payment/callback?payment_id={$payment->id}"),
                'cancel_url' => url('/student-dashboard'),
                'merchant_id' => config('services.hesabpay.merchant_id'),
            ]);

            $body = $response->json();
            
            Log::info('HesabPay Response', [
                'status' => $response->status(),
                'has_url' => isset($body['url']),
                'has_payment_url' => isset($body['payment_url'])
            ]);

            $redirectUrl = $body['payment_url'] ?? $body['url'] ?? null;

            if ($response->successful() && $redirectUrl) {
                // Update payment with the order ID if provided
                $payment->update([
                    'hesab_order_id' => $body['order_id'] ?? $body['session_id'] ?? null
                ]);

                return response()->json([
                    'redirect_url' => $redirectUrl
                ]);
            }

            Log::error('HesabPay Session Creation Failed', [
                'status' => $response->status(),
                'response' => $body
            ]);
            
            return response()->json([
                'message' => 'Payment initiation failed',
                'error' => $body['detail'] ?? $body['message'] ?? $body['response'] ?? $response->body()
            ], $response->status() == 200 ? 400 : $response->status());

        } catch (\Exception $e) {
            Log::error('HesabPay Error: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json(['message' => 'Payment gateway error', 'detail' => $e->getMessage()], 500);
        }
    }

    public function callback(Request $request)
    {
        $paymentId = $request->query('payment_id');
        $payment = Payment::findOrFail($paymentId);

        // In a real scenario, you would verify the transaction status with HesabPay API here
        // using the transaction_id or order_id sent back in the request.
        
        // Mocking success for demonstration if no actual API integration is possible yet
        $payment->status = 'success';
        $payment->transaction_id = $request->query('transaction_id') ?? 'MOCK_TRANS_123';
        $payment->save();

        // Enroll user
        Enrollment::firstOrCreate([
            'user_id' => $payment->user_id,
            'course_id' => $payment->course_id
        ]);

        return redirect(config('app.frontend_url') . '/student-dashboard?payment=success');
    }
}
