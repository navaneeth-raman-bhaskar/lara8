<?php

namespace App\Providers;

use App\Actions\CustomAction;
use App\FormFields\CustomFormField;
use Illuminate\Http\Request;
use Illuminate\Support\ServiceProvider;
use TCG\Voyager\Facades\Voyager;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        //
    }

    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        Voyager::addAction(CustomAction::class);
        Voyager::addFormField(CustomFormField::class);

        Request::macro('isShow', function () {
            return $this->route()->getActionMethod() === 'show';
        });
    }
}
