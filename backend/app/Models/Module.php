<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Module extends Model
{
    use HasFactory;

    protected $table = 'modules';
    protected $primaryKey = 'module_id';

    protected $fillable = ['instrument_id', 'title', 'level', 'order'];

    public function instrument(): BelongsTo
    {
        return $this->belongsTo(Instrument::class, 'instrument_id', 'instrument_id');
    }

    public function lessons(): HasMany
    {
        return $this->hasMany(Lesson::class, 'module_id', 'module_id')->orderBy('order', 'asc');
    }
}
