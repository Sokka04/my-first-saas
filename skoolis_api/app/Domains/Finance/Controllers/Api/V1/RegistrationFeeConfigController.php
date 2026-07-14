<?php

namespace App\Domains\Finance\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Domains\Finance\Models\RegistrationFeeConfig;
use Illuminate\Http\Request;

class RegistrationFeeConfigController extends Controller
{
    /**
     * Liste des tarifs configurés
     */
    public function index(Request $request)
    {
        $configs = RegistrationFeeConfig::with('schoolClass')->get();
        return response()->json([
            'status' => 'success',
            'data' => $configs
        ]);
    }

    /**
     * Enregistrer ou mettre à jour un tarif pour une classe
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'school_class_id' => 'required|uuid|exists:school_classes,id',
            'amount_boy' => 'required|numeric|min:0',
            'amount_girl' => 'required|numeric|min:0',
            'application_date' => 'nullable|date'
        ]);

        $validated['school_id'] = '11111111-1111-1111-1111-111111111111'; // Mock Auth::user()->school_id

        $config = RegistrationFeeConfig::updateOrCreate(
            ['school_class_id' => $validated['school_class_id']],
            [
                'school_id' => $validated['school_id'],
                'amount_boy' => $validated['amount_boy'],
                'amount_girl' => $validated['amount_girl'],
                'application_date' => $validated['application_date'] ?? now()->toDateString()
            ]
        );

        return response()->json([
            'status' => 'success',
            'data' => $config
        ]);
    }

    /**
     * Supprimer une configuration
     */
    public function destroy($id)
    {
        $config = RegistrationFeeConfig::findOrFail($id);
        $config->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Configuration supprimée avec succès'
        ]);
    }
}
