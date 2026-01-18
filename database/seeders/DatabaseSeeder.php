<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Denuncia;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
        ]);

        // Crear datos de prueba para denuncias
        Denuncia::create([
            'titulo' => 'Bache en la calle principal',
            'descripcion' => 'Existe un bache bastante grande en la calle principal que podría causar accidentes a los vehículos.',
            'categoria' => 'Infraestructura',
            'ubicacion' => 'Calle Principal #123',
            'estado' => 'Pendiente',
        ]);

        Denuncia::create([
            'titulo' => 'Asalto a mano armada',
            'descripcion' => 'Se reporta un asalto a mano armada en el parque central. Los delincuentes se dieron a la fuga en dirección a la avenida norte.',
            'categoria' => 'Delito',
            'ubicacion' => 'Parque Central',
            'estado' => 'En investigación',
        ]);

        Denuncia::create([
            'titulo' => 'Servicios públicos sin funcionar',
            'descripcion' => 'El alumbrado público en la zona de la playa no está funcionando desde hace tres semanas, lo que genera inseguridad en el sector.',
            'categoria' => 'Servicios',
            'ubicacion' => 'Zona de Playa Norte',
            'estado' => 'Resuelto',
        ]);
    }
}
