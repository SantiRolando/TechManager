<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Device;
use App\Models\Repair;
use Illuminate\Http\Request;

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
        //Validar datos de la reparacion del cliente, del equipo y del problema 
        $request->validate([
            'client_id' => 'required|exists:clients,id',
            'device_id' => 'nullable|exists:devices,id',
            'type' => 'required|string|max:255',
            'brand' => 'required|string|max:255',
            'model' => 'required|string|max:255',
            'serial_number' => 'nullable|string|max:255',
            'password_device' => 'nullable|string|max:255',
            'accesories' => 'nullable|string|max:255',
            'reported_problem' => 'required|string|max:255',
            'estimated_cost' => 'nullable|numeric',
        ]);


        try{
            DB::beginTransaction();

            //Primero verificamos si nos pasaron un device_id existente
            if($request->has('device_id') && $request->device_id){
                $device = Device::find($request->device_id);
            }else{
                //Si no nos pasaron un device_id, creamos un nuevo dispositivo
                $device = Device::create([
                    'client_id' => $request->client_id,
                    'type' => $request->type,
                    'brand' => $request->brand,
                    'model' => $request->model,
                    'serial_number' => $request->serial_number,
                    'password_device' => $request->password_device,
                    'accesories' => $request->accesories,
                ]);
            }
            //Creamos la reparación asociada al dispositivo
            $repair = Repair::create([
                'device_id' => $device->id,
                'reported_problem' => $request->reported_problem,
                'estimated_cost' => $request->estimated_cost,
            ]);
            DB::commit();
            return response()->json([
                'message' => 'Repair created successfully', 
                'repair' => $repair->load('device.client')
                ], 201);
        }
        catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'error' => 'Failed to create repair', 
                'message' => $e->getMessage()
                ], 500);
        }

    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
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
            'diagnosis', 
            'estimated_cost',
            'final_cost',]));
        
        return response()->json([
            'message' => 'Repair updated successfully',
            'repair' => $repair
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
