package jp.albedo.jeanmeeus.math;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;

class InterpolationTest {

    @Test
    void interpolate() {
        // Meeus p. 25
        double[] values = new double[]{0.884226, 0.877366, 0.870531};
        assertEquals(0.876125, Interpolation.interpolate(values, 4.35 / 24.0), 0.000001);
    }
}