<?php

namespace App\View\Components;

use Illuminate\View\Component;
use Illuminate\View\View;

class RemoveRow extends Component
{
    public $url;
    public $disabled;

    /**
     * Create a new component instance.
     *
     * @param $url
     * @param string $disabled
     */
    public function __construct($url, $disabled = '')
    {
        $this->disabled = $disabled;
        $this->url = $url;
    }

    /**
     * Get the view / contents that represent the component.
     *
     * @return View|string
     */
    public function render()
    {
        return view('components.remove-row')->with('hide', request()->isShow());
    }
}
