<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

final class SetPermissionsTeamFromUser
{
    public function handle(Request $request, Closure $next): Response
    {
        if ($user = $request->user()) {
            setPermissionsTeamId($user->school_id);
        }

        return $next($request);
    }
}
