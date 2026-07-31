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
        Schema::create('repairs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('device_id')->constrained('devices')->onDelete('cascade');//Dispositivo a reparar
            $table->text('problem_description');//Descripción del problema
            $table->text('diagnostic')->nullable();//Diagnóstico del problema
            $table->string('status')->default('Ingresado');//Estado de la reparación (Ingresado, Pendiente, En progreso, Terminado, Entregado)
            $table->string('description')->nullable();//Descripción del problema
            $table->decimal('estimasted_cost', 10, 2)->nullable();//Costo de la reparación
            $table->decimal('final_cost', 10, 2)->nullable();//Costo final de la reparación
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('repairs');
    }
};
