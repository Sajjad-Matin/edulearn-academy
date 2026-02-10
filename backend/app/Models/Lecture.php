<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Lecture extends Model
{
    use HasFactory;

    protected $fillable = [
        'section_id',
        'title',
        'video_type',
        'video_url',
        'content',
        'duration',
        'order',
        'is_preview'
    ];

    protected $casts = [
        'is_preview' => 'boolean',
    ];

    public function section()
    {
        return $this->belongsTo(Section::class);
    }
}
