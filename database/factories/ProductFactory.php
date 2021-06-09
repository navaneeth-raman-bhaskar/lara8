<?php

namespace Database\Factories;

use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;

class ProductFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Product::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'name' => $this->faker->word,
            'slug' => $this->faker->unique()->slug,
            'wip_id' => $this->faker->bothify('##??#'),
            'weight' => $this->faker->numerify('##'),
            'height' => $this->faker->numerify('##'),
            'width' => $this->faker->numerify('##'),
            'length' => $this->faker->numerify('##'),
            'image' => $this->faker->imageUrl(),
            'stock_left' => $this->faker->randomDigit,
            'status' => $this->faker->numberBetween(0,1),
        ];
    }
}
