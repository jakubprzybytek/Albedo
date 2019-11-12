package jp.albedo.jeanmeeus.ephemeris.common;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class MeanMotionTest {

    @Test
    void fromSemiMajorAxis() {
        assertEquals(0.300171252, MeanMotion.fromSemiMajorAxis(2.2091404), 0.000000001);
    }
}