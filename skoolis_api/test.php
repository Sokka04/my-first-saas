<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);
$user = \App\Domains\Auth\Models\User::first();
\Illuminate\Support\Facades\Auth::login($user);

$request = Illuminate\Http\Request::create('/api/v1/finance/accounting/bilan-general', 'GET');
$request->headers->set('Accept', 'application/json');
$response = $kernel->handle($request);
echo "General: " . $response->getContent() . "\n";

$request2 = Illuminate\Http\Request::create('/api/v1/finance/accounting/bilan-journalier', 'GET');
$request2->headers->set('Accept', 'application/json');
$response2 = $kernel->handle($request2);
echo "Daily: " . $response2->getContent() . "\n";
