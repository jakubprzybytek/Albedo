package jp.albedo.jpl.state.impl;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;

class ChebyshevPolynomialExpanderTest {

    @Test
    void computeFor() {

        final double[] coefficients = new double[]{1.0, 1.0, 1.0, 1.0};

        final ChebyshevPolynomialExpander expander = new ChebyshevPolynomialExpander(coefficients);

        assertEquals(0.0, expander.computeFor(-1.0));
        assertEquals(1.0, expander.computeFor(-0.5));
        assertEquals(0.0, expander.computeFor(0.0));
        assertEquals(0.0, expander.computeFor(0.5));
        assertEquals(4.0, expander.computeFor(1.0));
    }
}