<?php

namespace Database\Factories;

use App\Models\Job;
use App\Models\Location;
use Illuminate\Database\Eloquent\Factories\Factory;

class JobFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Job::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'title' => $this->faker->jobTitle(),
            'description' => $this->faker->sentence(),
            'min_experience' => 10-$this->faker->randomDigit(),
            'max_experience' => 10+$this->faker->randomDigit(),
            'min_ctc' => $this->faker->numerify('2####'),
            'max_ctc' => $this->faker->numerify('6#####'),
            'location_id'=>$this->faker->numberBetween(1,40),
        ];
    }
}
