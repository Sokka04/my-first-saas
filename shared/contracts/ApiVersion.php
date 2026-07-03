<?php

namespace Skoolis\Shared\Contracts;

/**
 * Contrat pour versionner les réponses ou clients (partagé hors Laravel si besoin).
 */
interface ApiVersion
{
    public function major(): int;
}
