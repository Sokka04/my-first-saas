<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckSchoolLicense
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if (!$user) {
            return $next($request);
        }

        // Si l'utilisateur est lié à une école dans son contexte actuel
        $schoolId = $request->header('X-School-ID') ?? session('current_school_id');

        if ($schoolId) {
            $license = \App\Domains\School\Models\License::where('school_id', $schoolId)
                            ->where('status', 'active')
                            ->where('valid_until', '>', now())
                            ->first();

            if (!$license) {
                return response()->json([
                    'error' => 'LICENSE_EXPIRED',
                    'message' => 'L\'abonnement de cette école est expiré ou invalide.'
                ], 402);
            }
        }

        return $next($request);
    }
}
