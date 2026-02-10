<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class CourseController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = \App\Models\Course::with(['teacher', 'sections.lectures', 'resources'])
            ->withCount(['sections', 'sections as lectures_count' => function($query) {
                $query->join('lectures', 'sections.id', '=', 'lectures.section_id');
            }]);

        if ($request->has('category')) {
            $query->where('category', $request->category);
        }

        // Filter based on user role
        $user = $request->user('sanctum');

        if (!$user) {
             // Guest -> Approved only
             $query->where('status', 'approved');
        } elseif ($user->role === 'student') {
             // Student -> Approved only
             $query->where('status', 'approved');
        } elseif ($user->role === 'teacher') {
             // Teacher -> Approved OR their own
             $query->where(function ($q) use ($user) {
                 $q->where('status', 'approved')
                   ->orWhere('teacher_id', $user->id);
             });
        }
        // Admin sees all by default

        return response()->json($query->get());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'teacher_id' => 'required|exists:users,id',
            'thumbnail' => 'nullable|image|max:2048',
            'price' => 'nullable|numeric',
            'level' => 'nullable|in:beginner,intermediate,advanced',
            'category' => 'nullable|string|max:100'
        ]);

        $data = $request->except('thumbnail');
        
        // Force status to pending unless admin (optional, for now all teachers create pending courses)
        $data['status'] = 'pending';
        if ($request->user()->role === 'admin') {
            $data['status'] = 'approved';
        }
        
        if ($request->hasFile('thumbnail')) {
            $path = $request->file('thumbnail')->store('thumbnails', 'public');
            $data['thumbnail_url'] = asset('storage/' . $path);
        }

        $course = \App\Models\Course::create($data);

        return response()->json($course, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $course = \App\Models\Course::with(['teacher', 'sections.lectures', 'resources'])->findOrFail($id);
        return response()->json($course);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $course = \App\Models\Course::findOrFail($id);

        $request->validate([
            'title' => 'string|max:255',
            'description' => 'nullable|string',
            'teacher_id' => 'exists:users,id',
            'thumbnail' => 'nullable|image|max:2048',
            'price' => 'nullable|numeric',
            'level' => 'nullable|in:beginner,intermediate,advanced',
            'category' => 'nullable|string|max:100'
        ]);

        $data = $request->except('thumbnail');
        
        if ($request->hasFile('thumbnail')) {
            // Delete old thumbnail if exists (optional but recommended)
            if ($course->thumbnail_url) {
                $oldPath = str_replace(asset('storage/'), '', $course->thumbnail_url);
                \Illuminate\Support\Facades\Storage::disk('public')->delete($oldPath);
            }
            
            $path = $request->file('thumbnail')->store('thumbnails', 'public');
            $data['thumbnail_url'] = asset('storage/' . $path);
        }

        $course->update($data);

        return response()->json($course);
    }

    /**
     * Remove the specified resource from storage.
     */
    /**
     * Add a section to the course.
     */
    public function addSection(Request $request, string $id)
    {
        $course = \App\Models\Course::findOrFail($id);
        
        $request->validate([
            'title' => 'required|string|max:255',
            'order' => 'nullable|integer'
        ]);

        $section = $course->sections()->create($request->only(['title', 'order']));

        return response()->json($section, 201);
    }

    /**
     * Add a lecture to a section.
     */
    public function addLecture(Request $request, string $sectionId)
    {
        $section = \App\Models\Section::findOrFail($sectionId);

        $request->validate([
            'title' => 'required|string|max:255',
            'video_type' => 'required|string|in:file,youtube',
            'video' => 'required_if:video_type,file|file|mimes:mp4,mov,avi,mkv,webm|max:2097152', // 2GB max
            'external_url' => 'nullable|string|url',
            'content' => 'nullable|string',
            'duration' => 'nullable|integer',
            'order' => 'nullable|integer',
            'is_preview' => 'nullable|boolean'
        ]);

        $data = $request->except(['video', 'external_url']);
        
        if ($request->video_type === 'file' && $request->hasFile('video')) {
            $path = $request->file('video')->store('lectures/videos', 'public');
            $data['video_url'] = asset('storage/' . $path);
        } elseif ($request->video_type === 'youtube' && $request->external_url) {
            $data['video_url'] = $request->external_url;
        }

        $lecture = $section->lectures()->create($data);

        return response()->json($lecture, 201);
    }

    public function destroy(string $id)
    {
        $course = \App\Models\Course::findOrFail($id);
        $course->delete();

        return response()->json(['message' => 'Course deleted successfully']);
    }

    /**
     * Add a resource (book) to the course.
     */
    public function addResource(Request $request, string $id)
    {
        $course = \App\Models\Course::findOrFail($id);

        $request->validate([
            'title' => 'required|string|max:255',
            'file' => 'required_without:link|file|mimes:pdf|max:51200', // 50MB max
            'link' => 'required_without:file|string', // FlipHTML5 link
            'type' => 'nullable|string'
        ]);

        $limit = strtolower(ini_get('post_max_size'));
        // logic to check sizes... ignored for now as we trust validation or server config

        $data = [
            'title' => $request->title,
            'type' => $request->type ?? 'book'
        ];

        if ($request->hasFile('file')) {
            $path = $request->file('file')->store('resources', 'public');
            $data['file_path'] = asset('storage/' . $path);
        } elseif ($request->link) {
            $data['link'] = $request->link;
            $data['type'] = 'fliphtml'; // Override type if it's a link
             // file_path is nullable now
             $data['file_path'] = null;
        }

        $resource = $course->resources()->create($data);

        return response()->json($resource, 201);
    }

    /**
     * Remove a resource.
     */
    /**
     * Remove a resource.
     */
    public function removeResource(string $id)
    {
        $resource = \App\Models\Resource::findOrFail($id);
        
        // Delete file from storage
        $path = str_replace(asset('storage/'), '', $resource->file_path);
        \Illuminate\Support\Facades\Storage::disk('public')->delete($path);
        
        $resource->delete();

        return response()->json(['message' => 'Resource deleted successfully']);
    }

    /**
     * Update course status (Admin only)
     */
    public function updateStatus(Request $request, string $id)
    {
        $course = \App\Models\Course::findOrFail($id);
        
        $request->validate([
            'status' => 'required|in:pending,approved,rejected'
        ]);

        $course->update(['status' => $request->status]);

        return response()->json(['message' => 'Course status updated', 'course' => $course]);
    }
}
