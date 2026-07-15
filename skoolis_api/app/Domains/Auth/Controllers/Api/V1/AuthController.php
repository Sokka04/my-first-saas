<?php

namespace App\Domains\Auth\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    public function login(Request $request): JsonResponse
    {
        $credentials = $request->validate([
            'email'    => ['required', 'email'],
            'password' => ['required'],
        ]);

        if (! Auth::attempt($credentials)) {
            return response()->json([
                'message' => 'Les identifiants fournis ne correspondent pas à nos enregistrements.',
            ], 401);
        }

        /** @var \App\Domains\Auth\Models\User $user */
        $user  = Auth::user();

        // Révoquer les anciens tokens de cette session pour éviter l'accumulation
        $user->tokens()->where('name', 'skoolis-app-session')->delete();

        // Créer un token Bearer — pas de CSRF requis, fonctionne cross-port
        $token = $user->createToken('skoolis-app-session')->plainTextToken;

        return response()->json([
            'token' => $token,
            'user'  => $user,
        ]);
    }

    public function logout(Request $request): JsonResponse
    {
        // Révoquer uniquement le token courant
        $request->user()?->currentAccessToken()?->delete();

        return response()->json(['message' => 'Déconnecté avec succès.']);
    }
}
