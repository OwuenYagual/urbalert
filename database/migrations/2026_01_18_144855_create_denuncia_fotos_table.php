<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('denuncia_fotos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('denuncia_id')->constrained('denuncias')->onDelete('cascade');
            $table->string('path'); // ej: denuncias/xxxx.jpg
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('denuncia_fotos');
    }
};

