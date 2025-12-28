<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreDenunciaRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // sin autenticación en este avance
    }

    public function rules(): array
    {
        return [
            'titulo' => ['required', 'string', 'min:5', 'max:120'],
            'descripcion' => ['required', 'string', 'min:10', 'max:2000'],
            'categoria' => ['required', 'string', 'min:3', 'max:60'],
            'ubicacion' => ['required', 'string', 'min:3', 'max:160'],
        ];
    }

    public function messages(): array
    {
        return [
            'titulo.required' => 'El título es obligatorio.',
            'descripcion.required' => 'La descripción es obligatoria.',
            'categoria.required' => 'La categoría es obligatoria.',
            'ubicacion.required' => 'La ubicación es obligatoria.',
        ];
    }
}
