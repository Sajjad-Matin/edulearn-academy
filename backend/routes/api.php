<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;

// Test route
Route::get('/', function () {
    return response()->json(['message' => 'API is working']);
});

// Login route
Route::post('/login', [AuthController::class, 'login'])->name('login');

// Payment Callback (Needs to be public for redirects/webhooks)
Route::get('/payment/callback', [\App\Http\Controllers\Api\PaymentController::class, 'callback']);

// Public course routes
Route::get('/courses', [\App\Http\Controllers\Api\CourseController::class, 'index']);
Route::get('/courses/{course}', [\App\Http\Controllers\Api\CourseController::class, 'show']);

// Register route
Route::post('/register', [AuthController::class, 'register']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/enroll', [\App\Http\Controllers\Api\EnrollmentController::class, 'enroll']);
    Route::get('/my-courses', [\App\Http\Controllers\Api\EnrollmentController::class, 'myCourses']);
    
    // Course management for teachers/admins
    Route::post('/courses', [\App\Http\Controllers\Api\CourseController::class, 'store']);
    Route::put('/courses/{course}', [\App\Http\Controllers\Api\CourseController::class, 'update']);
    Route::delete('/courses/{course}', [\App\Http\Controllers\Api\CourseController::class, 'destroy']);
    
    // Payments
    Route::post('/payment/initiate', [\App\Http\Controllers\Api\PaymentController::class, 'initiate']);
    
    
    Route::post('/courses/{id}/sections', [\App\Http\Controllers\Api\CourseController::class, 'addSection']);
    Route::post('/sections/{sectionId}/lectures', [\App\Http\Controllers\Api\CourseController::class, 'addLecture']);
    
    // Resource management
    Route::post('/courses/{id}/resources', [\App\Http\Controllers\Api\CourseController::class, 'addResource']);
    Route::delete('/resources/{id}', [\App\Http\Controllers\Api\CourseController::class, 'removeResource']);

    // Admin only routes
    Route::middleware('admin')->group(function () {
        Route::post('/admin/users', [\App\Http\Controllers\Api\AuthController::class, 'createUser']);
        Route::get('/admin/users', [\App\Http\Controllers\Api\AuthController::class, 'getUsers']);
        Route::put('/admin/users/{id}', [\App\Http\Controllers\Api\AuthController::class, 'updateUser']);
        Route::delete('/admin/users/{id}', [\App\Http\Controllers\Api\AuthController::class, 'deleteUser']);
        
        Route::put('/courses/{id}/status', [\App\Http\Controllers\Api\CourseController::class, 'updateStatus']);
    });
});
