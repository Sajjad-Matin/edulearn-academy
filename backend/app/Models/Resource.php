<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Resource extends Model
{
    protected $fillable = ['course_id', 'title', 'file_path', 'link', 'type'];

    public function course()
    {
        return $this->belongsTo(Course::class);
    }
}
