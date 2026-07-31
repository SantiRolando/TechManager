<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Client;
use Illuminate\Http\Request;

class ClienteController extends Controller
{

    //Funcion para obtener todos los clientes
    public function index(Request $request)
    {
        $search = $request->input('search');

        $clients = Client::when($search, function($query, $search){
            return $query->where('name', 'like', "%{$search}%")
                         ->orWhere('email', 'like', "%{$search}%");
        })->orderBy('created_at', 'desc')->get();

        return response()->json($clients);
    }

    //Funcion para guardar un nuevo Cliente
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'nullable|string|max:50',
            'email' => 'nullable|email|max:255',
            'address' => 'nullable|string|max:255',
        ]);

        $client = Client::create($validated);

        return response()->json([
            'mensaje' => 'Cliente creado correctamente',
            'Cliente' => $client
        ], 201);
    }

    //Ver a un Cliente especifico con sus equipos
    public function show(string $id)
    {
        $client = Client::with('devices')->findOrFail($id);

        return response()->json($client);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
