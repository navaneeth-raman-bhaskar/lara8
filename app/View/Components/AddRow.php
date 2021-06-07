<?php

namespace App\View\Components;

use Illuminate\View\Component;
use Illuminate\View\View;

class AddRow extends Component
{
    public $id;

    /**
     * Create a new component instance.
     *
     * @return void
     */
    public function __construct($id)
    {
        $this->id=$id;
    }

    /**
     * Get the view / contents that represent the component.
     *
     * @return View|string
     */
    public function render()
    {
        return view('components.add-row')->with('hide', request()->isShow());
    }
}
