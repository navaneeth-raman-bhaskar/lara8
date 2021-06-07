<?php

namespace App\Actions;

use TCG\Voyager\Actions\AbstractAction;

class CustomAction extends AbstractAction
{
    public function getTitle()
    {
        return 'Custom';
    }

    public function getIcon()
    {
        return 'voyager-eye';
    }

    public function getPolicy()
    {
        return 'read';
    }

    public function getAttributes()
    {
        return [
            'class' => 'btn btn-sm btn-success pull-right',
        ];
    }

    public function getDefaultRoute()
    {
        return route('home');
    }

    public function shouldActionDisplayOnDataType()
    {
        return $this->dataType->slug == 'posts';
    }

  /*  public function massAction($ids, $comingFrom)// for mass operation
    {
        // Do something with the IDs
        return redirect($comingFrom);
    }*/
}
