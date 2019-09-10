package jp.albedo.common;

import org.junit.jupiter.api.Test;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;

class JulianDateTest {

    @Test
    void fromDate() {
        assertEquals(2436116.31, JulianDate.fromDate(1957, 10, 4.81));
        assertEquals(2448170.5, JulianDate.fromDate(1990, 10, 6.0));
        assertEquals(2448193.04502, JulianDate.fromDate(1990, 10, 28.54502));
    }

    @Test
    void forRange() {
        List<Double> days = JulianDate.forRange(10.0, 45.0, 10.0);
        assertEquals(Arrays.asList(10.0, 20.0, 30.0, 40.0), days);
    }
}