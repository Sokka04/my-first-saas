<?php

namespace App\Domains\Student\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreStudentRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true; // tenant isolation is checked at route/policy level, but we can allow all authenticated users for now
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'first_name' => ['required', 'string', 'max:255'],
            'last_name' => ['required', 'string', 'max:255'],
            'birth_date' => ['nullable', 'date'],
            'gender' => ['nullable', 'string', 'in:M,F,Other'],
            'registration_number' => ['nullable', 'string', 'max:255'],
            'photo' => ['nullable', 'image', 'mimes:jpg,png,webp', 'max:5120'],
            'status' => ['nullable', 'string', 'in:nouveau,redoublant,triplant'],
            'birth_place' => ['nullable', 'string', 'max:255'],
            'address' => ['nullable', 'string'],
            'enrollment_date' => ['nullable', 'date'],
            'tuteur_nom' => ['nullable', 'string', 'max:255'],
            'tuteur_prenoms' => ['nullable', 'string', 'max:255'],
            'tuteur_contact' => ['nullable', 'string', 'max:255'],
            'tuteur_profession' => ['nullable', 'string', 'max:255'],
            'tuteur_email' => ['nullable', 'email', 'max:255'],
            'school_class_id' => ['required', 'uuid'],
        ];
    }
}
