<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Client extends Model
{
    use HasFactory;

    protected $table = 'clientes'; // O 'clients' según tu base de datos

    protected $fillable = [
        'nombre',
        'email',
        'telefono',
        'direccion',
    ];

    // Un cliente tiene muchos dispositivos
    public function devices()
    {
        return $this->hasMany(Device::class, 'client_id');
    }
}