<?php
use App\Http\Controllers\Api\ClienteController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\RepairController;

// 1. Rutas específicas de clientes PRIMERO
Route::get('/clientes', [ClienteController::class, 'index']);
Route::post('/clientes', [ClienteController::class, 'store']);
Route::get('/clientes/{id}/devicesporcliente', [ClienteController::class, 'showbydevice']);
Route::get('/clientes/{id}/devices', [ClienteController::class, 'devices']);

// 2. Ruta genérica con {id} DESPUÉS para que no intercepte a las anteriores
Route::get('/clientes/{id}', [ClienteController::class, 'show']);

// Rutas para Equipos y Reparaciones
Route::get('/repairs', [RepairController::class, 'index']);
Route::post('/repairs', [RepairController::class, 'store']);
Route::get('/repairs/{id}', [RepairController::class, 'show']);
Route::put('/repairs/{id}', [RepairController::class, 'update']);