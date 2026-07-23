<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Instrument extends Model
{
    use HasFactory;

    protected $table = 'instruments';
    protected $primaryKey = 'instrument_id';
    protected $fillable = ['name', 'image', 'image_description', 'is_active'];

    public function modules(): HasMany
    {
        return $this->hasMany(Module::class, 'instrument_id', 'instrument_id')->orderBy('order', 'asc');
    }

    public function songs(): HasMany
    {
        return $this->hasMany(Song::class, 'instrument_id', 'instrument_id');
    }
}
