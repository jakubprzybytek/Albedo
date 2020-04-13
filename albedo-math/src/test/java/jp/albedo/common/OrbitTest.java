package jp.albedo.common;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;

class OrbitTest {

    @Test
    void getOrbitalPeriod() {
        // Earth's Gaussian Year
        assertEquals(365.25689832632816, Orbit.getOrbitalPeriod(1.0), "Orbital period for Earth");
    }

}