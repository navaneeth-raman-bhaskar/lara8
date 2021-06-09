<?php

use App\Http\Controllers\Admin\ProductController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\JobController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});

Auth::routes(['verify' => true]);

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/home', [HomeController::class, 'index'])->name('home');
});


Route::group(['prefix' => 'admin'], function () {
    Voyager::routes();
});
Route::post('/admin/{model}/action/{id}', [ProductController::class, 'actionButton']);

Route::delete('/product/price/{price}', [ProductController::class, 'deletePrice'])->name('product.remove-price');


Route::resource('jobs', 'JobController')->only('index', 'show');
Route::get('jobs/apply', [JobController::class, 'apply']);
Route::get('jobs/applied', [JobController::class, 'applied']);
