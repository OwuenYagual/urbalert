<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

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

            'categoria' => [
                'required',
                'string',
                Rule::in([
                    'Seguridad',
                    'Salud pública',
                    'Alumbrado',
                    'Limpieza',
                    'Vías públicas',
                    'Ruido',
                    'Otros'
                ])
            ],

            // estado no se envía desde frontend, pero se protege igual
            'estado' => [
                'sometimes',
                'string',
                Rule::in([
                    'pendiente',
                    'en_revision',
                    'resuelta',
                    'rechazada'
                ])
            ],

            'ubicacion' => ['required', 'string', 'min:3', 'max:160'],
        ];
    }


    public function messages(): array
    {
        return [
            'titulo.required' => 'El título es obligatorio.',
            'titulo.min' => 'El título debe tener al menos 5 caracteres.',

            'descripcion.required' => 'La descripción es obligatoria.',
            'descripcion.min' => 'La descripción debe tener al menos 10 caracteres.',

            'categoria.required' => 'La categoría es obligatoria.',
            'categoria.in' => 'La categoría seleccionada no es válida.',

            'estado.in' => 'El estado proporcionado no es válido.',

            'ubicacion.required' => 'La ubicación es obligatoria.',
        ];
    }

}
