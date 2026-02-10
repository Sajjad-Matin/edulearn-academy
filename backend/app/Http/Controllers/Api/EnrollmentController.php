<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Enrollment;
use App\Models\Course;

class EnrollmentController extends Controller
{
    public function enroll(Request $request)
    {
        $request->validate([
            'course_id' => 'required|exists:courses,id'
        ]);

        $user = $request->user();
        
        $enrollment = Enrollment::firstOrCreate([
            'user_id' => $user->id,
            'course_id' => $request->course_id
        ]);

        return response()->json($enrollment, 201);
    }

    public function myCourses(Request $request)
    {
        $user = $request->user();
        $courses = Course::whereIn('id', Enrollment::where('user_id', $user->id)->pluck('course_id'))
            ->with('teacher')
            ->withCount(['sections', 'sections as lectures_count' => function($query) {
                $query->join('lectures', 'sections.id', '=', 'lectures.section_id');
            }])
            ->get();

        return response()->json($courses);
    }
}
