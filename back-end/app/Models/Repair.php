<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Repair extends Model
{
    use HasFactory;

    protected $table = 'repairs';

    protected $fillable = [
        'device_id',
        'problem_description',
        'diagnostic',
        'status',
        'description',
        'estimasted_cost',
        'final_cost',
    ];

    // Una reparación pertenece a un dispositivo
    public function device()
    {
        return $this->belongsTo(Device::class, 'device_id');
    }
}