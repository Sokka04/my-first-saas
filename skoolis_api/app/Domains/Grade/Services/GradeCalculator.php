<?php

namespace App\Domains\Grade\Services;

class GradeCalculator
{
    /**
     * Calcule la note de classe.
     * note_classe = (interrogation + devoir) / 2
     */
    public function calculateNoteClasse(?float $interrogation, ?float $devoir): ?float
    {
        if ($interrogation === null && $devoir === null) {
            return null;
        }

        $i = $interrogation ?? 0.0;
        $d = $devoir ?? 0.0;

        return ($i + $d) / 2;
    }

    /**
     * Calcule la moyenne de la matière pour une évaluation donnée.
     * moyenne_matiere = (note_classe + composition) / 2
     * ou (note_classe + examen_pratique) / 2
     */
    public function calculateMoyenneMatiere(
        ?float $interrogation,
        ?float $devoir,
        ?float $composition,
        ?float $examenPratique,
        string $evaluationType = 'composition'
    ): ?float {
        $noteClasse = $this->calculateNoteClasse($interrogation, $devoir);

        if ($noteClasse === null) {
            // Si pas de note de classe, la moyenne de la matière pourrait être uniquement la compo/examen
            // Mais en général, on considère que la moyenne n'est pas calculable sans note de classe,
            // ou alors elle est égale à la composition seule. Faisons la moyenne avec ce qu'on a.
            if ($evaluationType === 'examen_pratique') {
                return $examenPratique;
            }
            return $composition;
        }

        $evalNote = ($evaluationType === 'examen_pratique') ? $examenPratique : $composition;

        if ($evalNote === null) {
            return $noteClasse;
        }

        return ($noteClasse + $evalNote) / 2;
    }

    /**
     * Calcule la moyenne générale de la période.
     * moyenne_generale_periode = Σ(moyenne_matiere × coefficient) / Σ(coefficients)
     * 
     * @param array $matieres Tableau d'éléments ['moyenne' => float, 'coefficient' => float]
     */
    public function calculateMoyenneGenerale(array $matieres): ?float
    {
        $sumNotes = 0;
        $sumCoefs = 0;

        foreach ($matieres as $matiere) {
            if (isset($matiere['moyenne']) && $matiere['moyenne'] !== null) {
                $coef = $matiere['coefficient'] ?? 1;
                $sumNotes += $matiere['moyenne'] * $coef;
                $sumCoefs += $coef;
            }
        }

        if ($sumCoefs == 0) {
            return null;
        }

        return $sumNotes / $sumCoefs;
    }

    /**
     * Calcule la moyenne annuelle pour une matière.
     * moyenne_annuelle_matiere = (T1 + T2 + T3) / 3
     * 
     * @param array $moyennesPeriodiques Tableau de moyennes (float)
     */
    public function calculateMoyenneAnnuelleMatiere(array $moyennesPeriodiques): ?float
    {
        $validMoyennes = array_filter($moyennesPeriodiques, function($val) {
            return $val !== null;
        });

        $count = count($validMoyennes);
        if ($count === 0) {
            return null;
        }

        return array_sum($validMoyennes) / $count;
    }

    /**
     * Calcule le rang avec gestion des ex-aequo (méthode 1224).
     * 
     * @param array $moyennes Tableau associatif [student_id => moyenne]
     * @return array Tableau associatif [student_id => rang]
     */
    public function calculateRanking(array $moyennes): array
    {
        // Filtrer les valeurs nulles
        $validMoyennes = array_filter($moyennes, function($val) {
            return $val !== null;
        });

        // Trier par ordre décroissant
        arsort($validMoyennes);

        $ranking = [];
        $currentRank = 1;
        $rankStep = 0;
        $previousMoyenne = null;

        foreach ($validMoyennes as $studentId => $moyenne) {
            if ($previousMoyenne === null) {
                $ranking[$studentId] = $currentRank;
                $previousMoyenne = $moyenne;
                $rankStep++;
            } elseif ($moyenne == $previousMoyenne) {
                // Ex-aequo
                $ranking[$studentId] = $currentRank;
                $rankStep++;
            } else {
                $currentRank += $rankStep;
                $ranking[$studentId] = $currentRank;
                $previousMoyenne = $moyenne;
                $rankStep = 1;
            }
        }

        return $ranking;
    }
}
