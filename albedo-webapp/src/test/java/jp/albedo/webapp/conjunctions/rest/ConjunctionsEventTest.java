package jp.albedo.webapp.conjunctions.rest;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;

class ConjunctionsEventTest {

    @Test
    @DisplayName("Compute scoring for conjunction events")
    void findEdgeConjunctions() {
        assertEquals(10, ConjunctionEvent.computeScore(0.0));
        assertEquals(10, ConjunctionEvent.computeScore(0.9));
        assertEquals(9, ConjunctionEvent.computeScore(1.0));
        assertEquals(9, ConjunctionEvent.computeScore(1.4));
        assertEquals(8, ConjunctionEvent.computeScore(1.6));
        assertEquals(8, ConjunctionEvent.computeScore(2.0));
        assertEquals(8, ConjunctionEvent.computeScore(4.8));
        assertEquals(7, ConjunctionEvent.computeScore(5.1));
        assertEquals(6, ConjunctionEvent.computeScore(10.0));
        assertEquals(5, ConjunctionEvent.computeScore(30.0));
        assertEquals(4, ConjunctionEvent.computeScore(90.8));
        assertEquals(3, ConjunctionEvent.computeScore(150.1));
        assertEquals(3, ConjunctionEvent.computeScore(250.0));
        assertEquals(2, ConjunctionEvent.computeScore(500.0));
        assertEquals(2, ConjunctionEvent.computeScore(800.0));
        assertEquals(1, ConjunctionEvent.computeScore(1100.0));
    }
}