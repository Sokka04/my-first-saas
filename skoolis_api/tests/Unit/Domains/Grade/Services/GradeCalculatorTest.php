<?php

namespace Tests\Unit\Domains\Grade\Services;

use Tests\TestCase;
use App\Domains\Grade\Services\GradeCalculator;

class GradeCalculatorTest extends TestCase
{
    protected GradeCalculator $calculator;

    protected function setUp(): void
    {
        parent::setUp();
        $this->calculator = new GradeCalculator();
    }

    public function test_calculate_note_classe()
    {
        // Interro 14, devoir 10 => 12
        $this->assertEquals(12.0, $this->calculator->calculateNoteClasse(14.0, 10.0));
        
        // Uniquement devoir => (0 + 10)/2 = 5
        $this->assertEquals(5.0, $this->calculator->calculateNoteClasse(null, 10.0));
        
        // Tout nul => null
        $this->assertNull($this->calculator->calculateNoteClasse(null, null));
    }

    public function test_calculate_moyenne_matiere_composition()
    {
        // Interro 14, Devoir 10 => Note classe = 12. Compo 9 => Moyenne = (12 + 9) / 2 = 10.5
        $this->assertEquals(10.5, $this->calculator->calculateMoyenneMatiere(14.0, 10.0, 9.0, null, 'composition'));
        
        // Si pas de note de classe, retourne la compo
        $this->assertEquals(9.0, $this->calculator->calculateMoyenneMatiere(null, null, 9.0, null, 'composition'));
    }

    public function test_calculate_moyenne_matiere_examen_pratique()
    {
        // Interro 14, Devoir 10 => Note classe = 12. Pratique 16 => Moyenne = (12 + 16) / 2 = 14
        $this->assertEquals(14.0, $this->calculator->calculateMoyenneMatiere(14.0, 10.0, null, 16.0, 'examen_pratique'));
    }

    public function test_calculate_moyenne_generale()
    {
        $matieres = [
            ['moyenne' => 10.5, 'coefficient' => 2], // 21
            ['moyenne' => 14.0, 'coefficient' => 3], // 42
            ['moyenne' => 8.0, 'coefficient' => 1],  // 8
        ];
        // Total points: 71, Total coefs: 6. Moyenne: 71 / 6 = 11.8333...
        $this->assertEqualsWithDelta(11.833, $this->calculator->calculateMoyenneGenerale($matieres), 0.01);
    }

    public function test_calculate_ranking_method_1224()
    {
        $moyennes = [
            'student1' => 14.5,
            'student2' => 12.0,
            'student3' => 14.5,
            'student4' => 10.0,
            'student5' => 16.0,
        ];

        // Ordre attendu: 
        // 1: student5 (16.0)
        // 2: student1 (14.5)
        // 2: student3 (14.5)
        // 4: student2 (12.0)
        // 5: student4 (10.0)

        $ranking = $this->calculator->calculateRanking($moyennes);

        $this->assertEquals(1, $ranking['student5']);
        $this->assertEquals(2, $ranking['student1']);
        $this->assertEquals(2, $ranking['student3']);
        $this->assertEquals(4, $ranking['student2']);
        $this->assertEquals(5, $ranking['student4']);
    }
}
