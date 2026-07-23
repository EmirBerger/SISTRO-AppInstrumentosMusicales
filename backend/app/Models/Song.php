<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Song extends Model
{
    use HasFactory;

    protected $table = 'songs';
    protected $primaryKey = 'song_id';

    protected $fillable = ['instrument_id', 'title', 'artist', 'difficulty', 'file_url', 'image'];

    public function instrument(): BelongsTo
    {
        return $this->belongsTo(Instrument::class, 'instrument_id', 'instrument_id');
    }
}