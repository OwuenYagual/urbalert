<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateDenunciaEstadoRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'estado' => [
                'required',
                'string',
                Rule::in(['pendiente', 'en_revision', 'resuelta', 'rechazada']),
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'estado.required' => 'El estado es obligatorio.',
            'estado.in' => 'El estado proporcionado no es válido.',
        ];
    }
}
