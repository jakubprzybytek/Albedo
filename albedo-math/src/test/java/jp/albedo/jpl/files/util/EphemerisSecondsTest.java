package jp.albedo.jpl.files.util;

import jp.albedo.common.JulianDay;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;

public class EphemerisSecondsTest {

    @Test
    public void test() {
        assertEquals(-3.277299484800115E8, EphemerisSeconds.fromJde(2447751.8293));
        assertEquals(-14200747200.0, EphemerisSeconds.fromJde(JulianDay.fromDate(1549, 12, 31)));
        assertEquals(20514081600.0, EphemerisSeconds.fromJde(JulianDay.fromDate(2650, 1, 25)));
    }

}
