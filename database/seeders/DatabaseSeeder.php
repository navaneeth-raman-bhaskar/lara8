<?php

namespace Database\Seeders;

use App\Models\Qualification;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        // \App\Models\User::factory(10)->create();

        $this->call([
            EmployeeSeeder::class,
            LocationSeeder::class,
            Qualification::class,
            SkillSeeder::class,
            CountrySeeder::class,
            CurrencySeeder::class,
            JobSeeder::class,
            ProductSeeder::class,
        ]);
    }
}
