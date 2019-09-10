package jp.albedo.ephemeris.impl;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.util.Arrays;

import static org.junit.jupiter.api.Assertions.assertEquals;

class KeplerTest {

    @Test
    @DisplayName("Test if correct values are found")
    void resolve() {

        // from Jean Meeus' 'Astronomical Algorithms'
        KeplerTestParams testParamsArray[] = {
                new KeplerTestParams(5.0, 0.1, 5.554589, 0.000001),
                new KeplerTestParams(5.0, 0.2, 6.246908, 0.000001),
                new KeplerTestParams(5.0, 0.3, 7.134960, 0.000001),
                new KeplerTestParams(5.0, 0.4, 8.313903, 0.000001),
                new KeplerTestParams(5.0, 0.5, 9.950063, 0.000001),
                new KeplerTestParams(5.0, 0.6, 12.356653, 0.000001),
                new KeplerTestParams(5.0, 0.7, 16.167990, 0.000001),
                new KeplerTestParams(5.0, 0.8, 22.656579, 0.000001),
                new KeplerTestParams(5.0, 0.9, 33.344447, 0.000001),
                new KeplerTestParams(5.0, 0.99, 45.361023, 0.000001),
                new KeplerTestParams(1.0, 0.99, 24.725822, 0.000001),
                new KeplerTestParams(33.0, 0.99, 89.722155, 0.000001),
                new KeplerTestParams(204.269342, 0.0791158, -157.4677216, 0.0000001)
        };

        Arrays.stream(testParamsArray).forEach(testParams -> {
            final double eccentricAnomaly = Kepler.solve(Math.toRadians(testParams.meanAnomaly), testParams.eccentricity);
            assertEquals(Math.toRadians(testParams.expectedEccentricAnomaly), eccentricAnomaly, testParams.expectedDelta);
        });
    }

    private class KeplerTestParams {
        private double meanAnomaly;
        private double eccentricity;
        private double expectedEccentricAnomaly;
        private double expectedDelta;

        public KeplerTestParams(double meanAnomaly, double eccentricity, double expectedEccentricAnomaly, double expectedDelta) {
            this.meanAnomaly = meanAnomaly;
            this.eccentricity = eccentricity;
            this.expectedEccentricAnomaly = expectedEccentricAnomaly;
            this.expectedDelta = expectedDelta;
        }
    }
}