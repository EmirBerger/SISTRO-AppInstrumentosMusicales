<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LessonBlock extends Model
{
    protected $table = 'lesson_blocks';
    protected $primaryKey = 'block_id';

    protected $fillable = ['lesson_id', 'type', 'content', 'order'];

    protected $casts = [
        'content' => 'array',
    ];

    public function lesson(): BelongsTo
    {
        return $this->belongsTo(Lesson::class, 'lesson_id', 'lesson_id');
    }
}
