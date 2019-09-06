package jp.astro.ephemeris.common;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;

class TrueAnomalyTest {

    @Test
    void fromEccentricAnomaly() {
        final double trueAnomaly = TrueAnomaly.fromEccentricAnomaly(Math.toRadians(-34.026714), 0.8502196);
        assertEquals(Math.toRadians(-94.163310), trueAnomaly, 0.000001);
    }
}