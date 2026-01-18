<?php

namespace App\Policies;

use App\Models\Denuncia;
use App\Models\User;

class DenunciaPolicy
{
    public function update(User $user, Denuncia $denuncia): bool
    {
        return $user->isAdmin() || $denuncia->user_id === $user->id;
    }

    public function delete(User $user, Denuncia $denuncia): bool
    {
        return $user->isAdmin() || $denuncia->user_id === $user->id;
    }

    // Estado SOLO admin (lo usas en updateEstado)
    public function updateEstado(User $user, Denuncia $denuncia): bool
    {
        return $user->isAdmin();
    }
}
