<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class InstrumentSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('instruments')->insert([
            [
                'name'              => 'Guitarra',
                'image'             => 'sistroFiles/imageInstrument/MQ2ESWv69veS8umU95gIR56Pbp7w2DGmbHKpOX0H.jpg',
                'image_description' => 'imagen de una guitarra',
                'is_active'         => true,
                'created_at'        => now(),
                'updated_at'        => now(),
            ],
            // [
            //     'name'              => 'Piano',
            //     'image'             => null,
            //     'image_description' => 'imagen de un piano',
            //     'is_active'         => false,
            //     'created_at'        => now(),
            //     'updated_at'        => now(),
            // ],
            // [
            //     'name'              => 'Violín',
            //     'image'             => null,
            //     'image_description' => 'imagen de un violín',
            //     'is_active'         => false,
            //     'created_at'        => now(),
            //     'updated_at'        => now(),
            // ],
            // [
            //     'name'              => 'Batería',
            //     'image'             => null,
            //     'image_description' => 'imagen de una batería',
            //     'is_active'         => false,
            //     'created_at'        => now(),
            //     'updated_at'        => now(),
            // ],
        ]);
    }
}
