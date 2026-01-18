<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Denuncia extends Model
{
    use HasFactory;

    protected $table = 'denuncias';

    protected $fillable = [
        'user_id',
        'titulo',
        'descripcion',
        'categoria',
        'ubicacion',
        'lat',
        'lng',
        'estado',
    ];

    public function fotos()
    {
        return $this->hasMany(\App\Models\DenunciaFoto::class);
    }

    public function user()
    {
        return $this->belongsTo(\App\Models\User::class);
    }


}
