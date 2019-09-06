package jp.astro.ephemeris.common;

import jp.astro.ephemeris.common.MeanMotion;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class MeanMotionTest {

    @Test
    void fromSemiMajorAxis() {
        assertEquals(Math.toRadians(0.300171252), MeanMotion.fromSemiMajorAxis(2.2091404), 0.000000001);
    }
}