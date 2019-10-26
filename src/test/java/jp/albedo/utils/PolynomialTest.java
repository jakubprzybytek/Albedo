package jp.albedo.utils;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class PolynomialTest {

    @Test
    void compute() {
        assertEquals(4.0, Polynomial.compute(1.0, 1.0, 1.0, 1.0, 1.0));
        assertEquals(10.0, Polynomial.compute(1.0, 1.0, 4.0, 3.0, 2.0));
        assertEquals(37.0, Polynomial.compute(2.0, 1.0, 4.0, 3.0, 2.0));
    }
}