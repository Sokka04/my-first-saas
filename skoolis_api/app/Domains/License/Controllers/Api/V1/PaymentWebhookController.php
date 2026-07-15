<?php

namespace App\Domains\License\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use App\Domains\License\Services\LicenseGeneratorService;

class PaymentWebhookController extends Controller
{
    protected $licenseGenerator;

    public function __construct(LicenseGeneratorService $licenseGenerator)
    {
        $this->licenseGenerator = $licenseGenerator;
    }

    public function handleStripe(Request $request)
    {
        $payload = $request->getContent();
        $sigHeader = $request->header('Stripe-Signature');
        $endpointSecret = config('services.stripe.webhook_secret');

        try {
            // Utilisation du SDK Stripe officiel pour vérifier la signature
            $event = \Stripe\Webhook::constructEvent($payload, $sigHeader, $endpointSecret);
        } catch(\UnexpectedValueException $e) {
            Log::warning("Webhook Stripe invalide (payload).", ['ip' => $request->ip()]);
            return response()->json(['error' => 'Invalid payload'], 400);
        } catch(\Stripe\Exception\SignatureVerificationException $e) {
            Log::warning("Webhook Stripe invalide (signature mismatch).", ['ip' => $request->ip()]);
            return response()->json(['error' => 'Invalid signature'], 400);
        }

        if ($event->type === 'checkout.session.completed' || $event->type === 'payment_intent.succeeded') {
            $data = $event->data->object;
            // On attend le transaction_id dans les métadonnées envoyées lors de la création de la session Stripe
            $transactionId = $data->metadata->transaction_id ?? null;
            
            if (!$transactionId) {
                return response()->json(['message' => 'Missing transaction_id in metadata'], 200);
            }

            return $this->processTransaction($transactionId, 'stripe', $data->id);
        }

        return response()->json(['message' => 'Ignored. Not a success event.'], 200);
    }

    public function handleMobileMoney(Request $request)
    {
        // 1. VÉRIFICATION STRICTE DE LA SIGNATURE (HMAC Générique pour Mobile Money)
        $signature = $request->header('X-Webhook-Signature');
        $payload = $request->getContent();
        $webhookSecret = config('services.mobile_money.webhook_secret');
        
        $expectedSignature = hash_hmac('sha256', $payload, $webhookSecret);

        if (!hash_equals($expectedSignature, $signature ?? '')) {
            Log::warning("Tentative de webhook mobile_money invalide (signature mismatch).", ['ip' => $request->ip()]);
            return response()->json(['error' => 'Invalid signature'], 400);
        }

        $data = $request->json()->all();
        $transactionId = $data['transaction_id'] ?? null;

        if (!$transactionId || $data['status'] !== 'success') {
            return response()->json(['message' => 'Ignored. Not a success event.'], 200);
        }

        return $this->processTransaction($transactionId, 'mobile_money', $data['gateway_reference'] ?? null);
    }

    protected function processTransaction($transactionId, $gateway, $gatewayReference = null)
    {
        // 3. GÉNÉRATION ET VALIDATION AVEC VERROU ANTI-CONCURRENCE
        DB::beginTransaction();
        try {
            // lockForUpdate empêche qu'un double-webhook génère deux licences simultanément
            $transaction = DB::table('transactions')->where('id', $transactionId)->lockForUpdate()->first();
            
            if (!$transaction) {
                DB::rollBack();
                return response()->json(['error' => 'Transaction not found'], 404);
            }

            if ($transaction->status === 'success') {
                DB::rollBack();
                return response()->json(['message' => 'Transaction already processed'], 200);
            }

            DB::table('transactions')->where('id', $transactionId)->update([
                'status' => 'success',
                'gateway_reference' => $gatewayReference,
                'updated_at' => now(),
            ]);

            // L'émetteur "SYS0001" (Système d'achat libre-service)
            // 365 jours = 1 an fixe.
            $license = $this->licenseGenerator->generateAndAssign(
                $transaction->school_id, 
                $transaction->license_type, 
                365, 
                'SYS0001'
            );

            DB::commit();
            return response()->json(['message' => 'Webhook processed successfully'], 200);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error("Webhook Error ($gateway): " . $e->getMessage());
            return response()->json(['error' => 'Internal Server Error'], 500);
        }
    }
}
