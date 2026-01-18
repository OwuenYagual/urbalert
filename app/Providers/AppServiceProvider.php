<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Gate;
use App\Models\Denuncia;
use App\Policies\DenunciaPolicy;

class AppServiceProvider extends ServiceProvider
{

    public function boot(): void
    {
        Gate::policy(Denuncia::class, DenunciaPolicy::class);
    }
}
