<?php

namespace App\View\Components;

use Illuminate\View\Component;
use Illuminate\View\View;

class SubTable extends Component
{
    public $id;
    public $title;
    public $addRowId;

    /**
     * Create a new component instance.
     *
     * @param  string  $title
     * @param  string  $id
     */
    public function __construct($title='',$id = '',$addRowId='addRow')
    {
        $this->id = $id;
        $this->title = $title;
        $this->addRowId = $addRowId;
    }

    /**
     * Get the view / contents that represent the component.
     *
     * @return View|string
     */
    public function render()
    {
        return view('components.sub-table');
    }
}
