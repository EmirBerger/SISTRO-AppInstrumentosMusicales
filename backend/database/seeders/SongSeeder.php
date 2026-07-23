<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Instrument;
use App\Models\Song;

class SongSeeder extends Seeder
{
    public function run(): void
    {
        $guitarra = Instrument::where('name', 'Guitarra')->first();

        if ($guitarra) {
            Song::create([
                'instrument_id' => $guitarra->instrument_id,
                'title'         => 'Come As You Are',
                'artist'        => 'Nirvana',
                'difficulty'    => 'Easy',
                'file_url'      => '/songs/come_as_you_are.xml',
            ]);

            Song::create([
                'instrument_id' => $guitarra->instrument_id,
                'title'         => 'Wish You Were Here',
                'artist'        => 'Pink Floyd',
                'difficulty'    => 'Medium',
                'file_url'      => '/songs/wish_you_were_here.xml',
            ]);
        }
    }
}