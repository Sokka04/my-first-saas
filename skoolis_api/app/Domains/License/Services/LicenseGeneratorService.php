<?php

namespace App\Domains\License\Services;

use App\Domains\School\Models\License;
use App\Domains\School\Models\LicenseIssuer;
use Illuminate\Support\Str;
use Carbon\Carbon;

class LicenseGeneratorService
{
    /**
     * Génère une nouvelle clé de licence.
     * 
     * @param string $type Code du type de licence (ex: P4R5YO)
     * @param LicenseIssuer $issuer
     * @param string $version Version de l'application (ex: SKL2026)
     * @return string La clé complète formatée.
     */
    public function generateKey(string $type, LicenseIssuer $issuer, string $version = 'SKL2026'): string
    {
        $uniqueId = strtoupper(Str::random(8)); // 8 caractères uniques
        $issuerCode = $issuer->issuer_code;
        
        $baseString = sprintf('%s-%s-%s-%s', $version, $type, $uniqueId, $issuerCode);
        
        $checksum = $this->calculateChecksum($baseString);
        
        return sprintf('%s-%s', $baseString, $checksum);
    }

    /**
     * Valide l'intégrité cryptographique d'une clé (vérifie que le checksum correspond).
     */
    public function isValidKeyFormat(string $licenseKey): bool
    {
        $parts = explode('-', $licenseKey);
        
        if (count($parts) !== 5) {
            return false;
        }

        $checksum = array_pop($parts); // Extrait le bloc 5
        $baseString = implode('-', $parts); // Reconstitue les 4 premiers blocs

        return hash_equals($this->calculateChecksum($baseString), $checksum);
    }

    /**
     * Génère la clé et l'enregistre en base de données pour une école.
     */
    public function generateAndAssign(string $schoolId, string $type, int $daysValid, string $issuerCode = 'SYS0001'): License
    {
        $issuer = LicenseIssuer::where('issuer_code', $issuerCode)->firstOrFail();
        
        $key = $this->generateKey($type, $issuer);
        
        // S'assurer qu'aucune autre licence n'a exactement la même clé (très improbable)
        while (License::where('license_key', $key)->exists()) {
            $key = $this->generateKey($type, $issuer);
        }

        return License::create([
            'school_id' => $schoolId,
            'license_key' => $key,
            'issued_by' => $issuer->id,
            'status' => 'active',
            'type' => $type,
            'valid_until' => Carbon::now()->addDays($daysValid),
        ]);
    }

    /**
     * Calcule le checksum cryptographique basé sur le secret de l'application.
     */
    protected function calculateChecksum(string $baseString): string
    {
        $secret = config('app.key');
        
        // Hash HMAC-SHA256
        $hash = hash_hmac('sha256', $baseString, $secret);
        
        // Pour rester robuste et simple : 
        // 1. Prendre les 5 premiers caractères alphanumériques de l'empreinte MD5 du hash
        // 2. Mettre en majuscules
        // 3. Remplacer O,0,I,1 pour éviter les ambiguïtés à la lecture
        $shortHash = strtoupper(substr(md5($hash), 0, 5));
        
        return strtr($shortHash, ['0' => 'X', 'O' => 'Y', '1' => 'Z', 'I' => 'W']);
    }
}
