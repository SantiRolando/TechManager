<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('devices', function (Blueprint $table) {
            $table->id();
            $table->foreignId('client_id')->constrained('clientes')->onDelete('cascade');//Duenio de la PC
            $table->string('type');//Tipo de dispositivo (PC, Laptop, Tablet, etc.)
            $table->string('brand');//Marca del dispositivo
            $table->string('model');//Modelo del dispositivo
            $table->string('serial_number')->nullable();//Número de serie del dispositivo
            $table->string('password_device')->nullable();//Contraseña del dispositivo
            $table->string('description')->nullable();//Descripción del dispositivo
            $table->timestamps();

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('devices');
    }
};
