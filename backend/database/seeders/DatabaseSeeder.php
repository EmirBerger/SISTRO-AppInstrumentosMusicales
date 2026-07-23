<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Database\Seeders\Lessons\GuitarraSeeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            UserSeeder::class,
            InstrumentSeeder::class,
            GuitarraSeeder::class,
            SongSeeder::class,
        ]);
    }
}