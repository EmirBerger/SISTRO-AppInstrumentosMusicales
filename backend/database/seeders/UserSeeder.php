<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('users')->insert([
            [
                'name'      => 'Emir',
                'last_name' => 'Berger',
                'email'     => 'emir@gmail.com',
                'password'  => Hash::make('123456'),
                'rol'       => 0,
                'hearts'    => 5,
                'plan'      => 'free',
            ],
            [
                'name'      => 'Admin',
                'last_name' => 'Dios',
                'email'     => 'admin@gmail.com',
                'password'  => Hash::make('admin123'),
                'rol'       => 1,
                'hearts'    => 5,
                'plan'      => 'premium'
            ],
        ]);
    }
}
