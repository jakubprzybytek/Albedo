package jp.albedo.jpl.files.util;

import jp.albedo.common.JulianDay;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;

public class EphemerisSecondsTest {

    @Test
    public void testFromJde() {
        assertEquals(-3.277299484800115E8, EphemerisSeconds.fromJde(2447751.8293));
        assertEquals(-14200747200.0, EphemerisSeconds.fromJde(JulianDay.fromDate(1549, 12, 31)));
        assertEquals(20514081600.0, EphemerisSeconds.fromJde(JulianDay.fromDate(2650, 1, 25)));
    }

    @Test
    public void testToJde() {
        assertEquals(2447751.8293, EphemerisSeconds.toJde(-3.277299484800115E8));
        assertEquals(JulianDay.fromDate(1549, 12, 31), EphemerisSeconds.toJde(-14200747200.0));
        assertEquals(JulianDay.fromDate(2650, 1, 25), EphemerisSeconds.toJde(20514081600.0));
    }

}
