package jp.albedo.math;

import org.junit.jupiter.api.Test;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;

class InterpolationTest {

    @Test
    void interpolate() {
        // Meeus p. 25
        List<Double> values = Arrays.asList(0.884226, 0.877366, 0.870531);
        assertEquals(0.876125, Interpolation.interpolate(values, 4.35 / 24.0), 0.000001);
    }
}