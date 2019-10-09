package jp.albedo.jpl.impl;

import jp.albedo.jpl.JPLException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;

import static org.junit.jupiter.api.Assertions.*;

class TimeSpanTest {

    TimeSpan timeSpan;

    @BeforeEach
    void setUp() {
        this.timeSpan = new TimeSpan(100.0, 200.0);
    }

    @Test
    void inside() {
        assertFalse(timeSpan.inside(99.99));
        assertTrue(timeSpan.inside(100.0));
        assertTrue(timeSpan.inside(150.0));
        assertTrue(timeSpan.inside(200.0));
        assertFalse(timeSpan.inside(200.01));
    }

    @Test
    void normalizeFor() throws JPLException {
        assertEquals(-1.0, timeSpan.normalizeFor(100.0));
        assertEquals(-0.5, timeSpan.normalizeFor(125.0));
        assertEquals(0.0, timeSpan.normalizeFor(150.0));
        assertEquals(0.5, timeSpan.normalizeFor(175.0));
        assertEquals(1.0, timeSpan.normalizeFor(200.0));
    }

    @ParameterizedTest
    @ValueSource(doubles = {50.0, 250.0})
    void normalizeForWithException(double value) {
        Throwable thrown = assertThrows(JPLException.class, () -> {
            this.timeSpan.normalizeFor(value);
        });

        assertTrue(thrown.getMessage().startsWith("Cannot normalize"));
    }

}