package jp.albedo.jpl.impl;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class TimeSpanTest {

    @Test
    void inside() {
        final TimeSpan timeSpan = new TimeSpan(100.0, 200.0);
        assertFalse(timeSpan.inside(99.99));
        assertTrue(timeSpan.inside(100.0));
        assertTrue(timeSpan.inside(150.0));
        assertTrue(timeSpan.inside(200.0));
        assertFalse(timeSpan.inside(200.01));
    }

    @Test
    void normalizeFor() {
        final TimeSpan timeSpan = new TimeSpan(100.0, 200.0);
        assertEquals(0.0, timeSpan.normalizeFor(100.0));
        assertEquals(0.5, timeSpan.normalizeFor(150.0));
        assertEquals(1.0, timeSpan.normalizeFor(200.0));
    }
}