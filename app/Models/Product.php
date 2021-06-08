<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use TCG\Voyager\Traits\Resizable;

class Product extends Model
{
    use HasFactory;
    use Resizable;

    public function prices(): HasMany
    {
        return $this->hasMany(Price::class);
    }

    public function commissions(): HasMany
    {
        return $this->hasMany(Commission::class);
    }

    public function savePrices($request)
    {
        $existingSubs = $this->prices;
        for ($i = 0; $i < count($request['prices-id']); $i++) {
            $sub =$existingSubs->find($request['prices-id'][$i]) ?: new Price();
            $sub->country_id = $request['country'][$i];
            $sub->currency_id = $request['currency'][$i];
            $sub->gross_price = $request['gross_price'][$i];
            $sub->net_price = $request['net_price'][$i];
            $sub->point_value = $request['point_value'][$i];
            $this->prices()->save($sub);
        }
    }

}
