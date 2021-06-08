<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ProductPriceRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
       // return $this->authorize('add', Prices::class);
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'prices-id.*'=>'present',
            'country.*'=>'required|integer',
            'currency.*'=>'required|integer',
            'gross_price.*'=>'required|numeric',
            'net_price.*'=>'required|numeric',
            'point_value.*'=>'required|numeric',
        ];
    }
}
