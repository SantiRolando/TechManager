<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Client extends Model
{
    // Si tu tabla en la base de datos se llama "clientes", indícalo aquí:
    protected $table = 'clientes';

    // Agrega los campos que permites guardar de forma masiva:
    protected $fillable = [
        'nombre',
        'email',
        'telefono',
        'direccion'
    ];
}