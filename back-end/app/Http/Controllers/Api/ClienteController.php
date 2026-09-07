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
            'nombre' => 'required|string|max:255',
            'telefono' => 'nullable|string|max:50',
            'email' => 'nullable|email|max:255',
            'direccion' => 'nullable|string|max:255',
        ]);

        $client = Client::create($validated);

        return response()->json([
            'mensaje' => 'Cliente creado correctamente',
            'Cliente' => $client
        ], 201);
    }

   // Ver a un Cliente específico con sus equipos y las reparaciones de cada uno
    public function show(string $id)
    {
        $client = Client::with('devices.repairs')->findOrFail($id);

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

    // Obtener los dispositivos de un cliente específico
    public function devices($id)
    {
        $cliente = Client::find($id);

        if (!$cliente) {
            return response()->json(['error' => 'Cliente no encontrado'], 404);
        }

        return response()->json($cliente->devices);
    }

    // Mostrar la información de un cliente específico con sus dispositivos
    public function showbydevice($id)
    {
        $cliente = Client::with('devices')->find($id);

        if (!$cliente) {
            return response()->json([
                'error' => 'Cliente no encontrado'
            ], 404);
        }

        return response()->json($cliente, 200);
    }


}
