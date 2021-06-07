<?php

namespace App\View\Components;

use Illuminate\Contracts\View\View;
use Illuminate\View\Component;

class ModelId extends Component
{
    public $model;

    /**
     * Create a new component instance.
     *
     * @param $value
     */
    public function __construct($model)
    {
        $this->model=$model;
    }

    /**
     * Get the view / contents that represent the component.
     *
     * @return View|\Closure|string
     */
    public function render()
    {
        return view('components.model-id');
    }
}
