<?php

namespace App\FormFields;

use TCG\Voyager\FormFields\AbstractHandler;

class CustomFormField extends AbstractHandler
{
    protected $codename = 'custom';

    public function createContent($row, $dataType, $dataTypeContent, $options)
    {
        return view('formfields.custom', [
            'row' => $row,
            'options' => $options,
            'dataType' => $dataType,
            'dataTypeContent' => $dataTypeContent
        ]);
    }
}
