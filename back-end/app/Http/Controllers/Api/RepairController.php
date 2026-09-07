<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Device;
use App\Models\Repair;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB; // <-- ¡Faltaba importar DB!

class RepairController extends Controller
{
    //Listar todas las reparaciones
    public function index()
    {
        $repairs = Repair::with(['device.client'])
            ->orderBy('created_at', 'desc')->get();

        return response()->json($repairs);
    }

    //Registrar una nueva reparación
    public function store(Request $request)
    {
        // Esto escribirá los datos exactos que llegan en el archivo de logs de Laravel
        \Illuminate\Support\Facades\Log::info('Datos recibidos en store:', $request->all());
        // Validamos apuntando a la tabla correcta 'clientes'
        $request->validate([
            'client_id'           => 'required|exists:clientes,id', 
            'device_id'           => 'nullable|exists:devices,id',
            // Solo obligatorios si NO viene un device_id existente
            'type'                => 'required_without:device_id|nullable|string|max:255',
            'brand'               => 'required_without:device_id|nullable|string|max:255',
            'model'               => 'required_without:device_id|nullable|string|max:255',
            'serial_number'       => 'nullable|string|max:255',
            'password_device'     => 'nullable|string|max:255',
            'accesories'          => 'nullable|string|max:255',
            'problem_description' => 'required|string',
            'estimasted_cost'     => 'nullable|numeric',
        ]);

   // dd($request->all());

        try {
            DB::beginTransaction();

            // Verificamos si nos pasaron un device_id existente
            if ($request->has('device_id') && $request->device_id) {
                $device = Device::find($request->device_id);
            } else {
                // Creamos la instancia vacía del dispositivo
                $device = new Device();
                $device->client_id = $request->client_id; // Asignación directa y explícita
                $device->type = $request->type;
                $device->brand = $request->brand;
                $device->model = $request->model;
                $device->serial_number = $request->serial_number;
                $device->password_device = $request->password_device;
                $device->description = $request->accesories;
                $device->save(); // Guardamos manualmente
            
            }

            // Creamos la reparación usando los nombres exactos de tu migración
            $repair = Repair::create([
                'device_id'           => $device->id,
                'problem_description' => $request->problem_description,
                'diagnostic'          => $request->diagnostic, // <--- Añadido si lo usas
                'estimasted_cost'     => $request->estimasted_cost,
                'status'              => $request->status ?? 'Ingresado', // <--- Toma el del form o por defecto
            ]);

            DB::commit();

            return response()->json([
                'message' => 'Repair created successfully', 
                'repair'  => $repair->load('device.client')
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'error'   => 'Failed to create repair', 
                'message' => $e->getMessage()
            ], 500);
        }
    }

    // Mostrar una reparación específica con su dispositivo y cliente
    public function show($id)
    {
        $repair = Repair::with('device.client')->find($id);

        if (!$repair) {
            return response()->json([
                'error' => 'Reparación no encontrada'
            ], 404);
        }

        return response()->json($repair, 200);
    }
    //Actualizar el estado o diagnostico de una reparación
    public function update(Request $request, string $id)
    {
        $repair = Repair::find($id);
        if (!$repair) {
            return response()->json([
                'error' => 'Repair not found'
            ], 404);
        }
        $repair->update($request->only([
            'status', 
            'diagnostic', 
            'estimasted_cost',
            'final_cost',
        ]));
        
        return response()->json([
            'message' => 'Repair updated successfully',
            'repair'  => $repair
        ]);
    }

    public function destroy(string $id)
    {
        //
    }
}