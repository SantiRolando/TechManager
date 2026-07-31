<?php
use App\Http\Controllers\Api\ClienteController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\RepairController;

// Rutas para Clientes
Route::get('/clients', [ClienteController::class, 'index']);
Route::post('/clients', [ClienteController::class, 'store']);
Route::get('/clients/{id}', [ClienteController::class, 'show']);

// Rutas para Equipos y Reparaciones
Route::get('/repairs', [RepairController::class, 'index']);
Route::post('/repairs', [RepairController::class, 'store']);
Route::put('/repairs/{id}', [RepairController::class, 'update']);