package jp.astro.common;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class JulianDateTest {

    @Test
    void fromDate() {
        assertEquals(2436116.31, JulianDate.fromDate(1957, 10, 4.81));
        assertEquals(2448170.5, JulianDate.fromDate(1990, 10, 6.0));
        assertEquals(2448193.04502, JulianDate.fromDate(1990, 10, 28.54502));
    }
}