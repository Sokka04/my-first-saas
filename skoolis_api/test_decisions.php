<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$classId = App\Domains\School\Models\SchoolClass::first()->id ?? null;
$yearId = App\Domains\School\Models\SchoolYear::first()->id ?? null;

if (!$classId || !$yearId) {
    echo "Missing class or year\n";
    exit;
}

$request = Illuminate\Http\Request::create('/api/v1/decisions/generate', 'POST', ['school_class_id' => $classId, 'school_year_id' => $yearId]);
$controller = app()->make(App\Domains\Grade\Controllers\Api\V1\StudentDecisionController::class);
$response = $controller->generate($request);
echo "GENERATE:\n" . $response->getContent() . "\n\n";

$decision = App\Domains\Grade\Models\StudentDecision::first();
if ($decision) {
    $request = Illuminate\Http\Request::create('/api/v1/decisions/' . $decision->id . '/override', 'PUT', ['decision' => 'exclu']);
    $response = $controller->override($request, $decision->id);
    echo "OVERRIDE:\n" . $response->getContent() . "\n";
}
