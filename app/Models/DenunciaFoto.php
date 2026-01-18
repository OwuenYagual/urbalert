<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DenunciaFoto extends Model
{
    protected $fillable = ['denuncia_id', 'path'];

    public function denuncia()
    {
        return $this->belongsTo(Denuncia::class);
    }
}

