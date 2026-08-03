<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\InstrumentController;
use App\Http\Controllers\LessonsController;
use App\Http\Controllers\SongsController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ModuleController;
use App\Http\Controllers\UploadController;
/**############### RUTAS DE DATOS (requieren estar logueado) ############### */

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/instrumentos', [InstrumentController::class, 'getInstruments']);
    Route::get('/instrumentos/{id}', [LessonsController::class, 'getInstrumentMap'])
        ->whereNumber('id');
    Route::get('/modulo/{id}', [LessonsController::class, 'getLesson'])
        ->whereNumber('id');
    Route::post('/instrumento/{id}/modulo/iniciar', [LessonsController::class, 'startLesson'])
        ->whereNumber('id');
    Route::get('/canciones', [SongsController::class, 'getAllSongs']);
    Route::get('/canciones/{instrumentId}', [SongsController::class, 'getSongsByInstrument'])
        ->whereNumber('instrumentId');
    Route::get('/cancion/{id}', [SongsController::class, 'getSong'])
        ->whereNumber('id');
    Route::get('/cancion/{id}/partitura', [SongsController::class, 'streamSheet'])
        ->whereNumber('id');
});

/**################################# RUTAS DEL ADMIN ################################# */

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/admin/instrumento/nuevo', [InstrumentController::class, 'createInstrument']);
    Route::post('/admin/instrumento/{id}/editar', [InstrumentController::class, 'editInstrument'])
        ->whereNumber('id');
    Route::post('/admin/instrumento/{id}/eliminar', [InstrumentController::class, 'deleteInstrument'])
        ->whereNumber('id');
    Route::post('/admin/clase/nuevo', [ModuleController::class, 'createModule']);
    Route::post('/admin/clase/{id}/editar', [ModuleController::class, 'editModule'])
        ->whereNumber('id');
    Route::post('/admin/clase/{id}/eliminar', [ModuleController::class, 'deleteModule'])
        ->whereNumber('id');
    Route::post('/admin/modulo/nuevo', [LessonsController::class, 'createLesson']);
    Route::post('/admin/modulo/{id}/editar', [LessonsController::class, 'editLesson'])
        ->whereNumber('id');
    Route::post('/admin/modulo/{id}/bloques', [LessonsController::class, 'saveBlocks'])
        ->whereNumber('id');
    Route::post('/admin/modulo/{id}/eliminar', [LessonsController::class, 'deleteLesson'])
        ->whereNumber('id');
    Route::post('/admin/upload/imagen', [UploadController::class, 'uploadImage']);
    Route::post('/admin/cancion/nuevo', [SongsController::class, 'createSong']);
    Route::post('/admin/cancion/{id}/editar', [SongsController::class, 'editSong'])
        ->whereNumber('id');
    Route::post('/admin/cancion/{id}/eliminar', [SongsController::class, 'deleteSong'])
        ->whereNumber('id');
});

/**################################# RUTAS DE SESION ################################# */

Route::post('/crear-cuenta', [AuthController::class, 'register']);
Route::post('/iniciar-sesion', [AuthController::class, 'login'])
    ->name('login');
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/cerrar-sesion', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
});