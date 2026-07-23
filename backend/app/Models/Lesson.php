<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Lesson extends Model
{
    use HasFactory;

    protected $table = 'lessons';
    protected $primaryKey = 'lesson_id';

    protected $fillable = ['module_id', 'title', 'theory_content', 'order'];

    public function module(): BelongsTo
    {
        return $this->belongsTo(Module::class, 'module_id', 'module_id');
    }

    public function blocks(): HasMany
    {
        return $this->hasMany(LessonBlock::class, 'lesson_id', 'lesson_id')->orderBy('order', 'asc');
    }
}
