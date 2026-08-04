<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Device extends Model
{
    use HasFactory;

    protected $table = 'devices';

    // Asegúrate de que SOLO esté esto y nada de protected $guarded = [];
    protected $fillable = [
        'client_id',
        'type',
        'brand',
        'model',
        'serial_number',
        'password_device',
        'description',
    ];

    public function client()
    {
        return $this->belongsTo(Client::class, 'client_id');
    }

    public function repairs()
    {
        return $this->hasMany(Repair::class, 'device_id');
    }
}