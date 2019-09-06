package jp.astro.ephemeris.common;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class LightTimeTest {

    @Test
    void fromDistance() {
        assertEquals(0.00476, LightTime.fromDistance(0.8243689), 0.00001);
    }
}