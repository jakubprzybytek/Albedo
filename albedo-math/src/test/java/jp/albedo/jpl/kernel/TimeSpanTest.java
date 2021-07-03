package jp.albedo.jpl.kernel;

import jp.albedo.jpl.JplException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;

import java.util.List;

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
    void ovelaps() {
        assertTrue(timeSpan.overlaps(new TimeSpan(120.0, 180.0)));
        assertTrue(timeSpan.overlaps(new TimeSpan(50.0, 250.0)));
        assertTrue(timeSpan.overlaps(new TimeSpan(50.0, 100.0)));
        assertTrue(timeSpan.overlaps(new TimeSpan(50.0, 150.0)));
        assertTrue(timeSpan.overlaps(new TimeSpan(150.0, 250.0)));
        assertTrue(timeSpan.overlaps(new TimeSpan(200.0, 250.0)));
        assertFalse(timeSpan.overlaps(new TimeSpan(300.0, 350.0)));
        assertFalse(timeSpan.overlaps(new TimeSpan(50.0, 80.0)));
    }

    @Test
    void normalizeFor() throws JplException {
        assertEquals(-1.0, timeSpan.normalizeFor(100.0));
        assertEquals(-0.5, timeSpan.normalizeFor(125.0));
        assertEquals(0.0, timeSpan.normalizeFor(150.0));
        assertEquals(0.5, timeSpan.normalizeFor(175.0));
        assertEquals(1.0, timeSpan.normalizeFor(200.0));
    }

    @ParameterizedTest
    @ValueSource(doubles = {50.0, 250.0})
    void normalizeForWithException(double value) {
        Throwable thrown = assertThrows(JplException.class, () -> {
            this.timeSpan.normalizeFor(value);
        });

        assertTrue(thrown.getMessage().startsWith("Cannot normalize"));
    }

    @Test
    void spittingToOneSpan() {
        List<TimeSpan> splitTimeSpans = this.timeSpan.splitTo(1);
        assertEquals(1, splitTimeSpans.size());

        assertEquals(100.0, splitTimeSpans.get(0).getFrom());
        assertEquals(200.0, splitTimeSpans.get(0).getTo());
    }

    @Test
    void spittingToFourSpans() {
        List<TimeSpan> splitTimeSpans = this.timeSpan.splitTo(4);
        assertEquals(4, splitTimeSpans.size());

        assertEquals(100.0, splitTimeSpans.get(0).getFrom());
        assertEquals(125.0, splitTimeSpans.get(0).getTo());

        assertEquals(125.0, splitTimeSpans.get(1).getFrom());
        assertEquals(150.0, splitTimeSpans.get(1).getTo());

        assertEquals(150.0, splitTimeSpans.get(2).getFrom());
        assertEquals(175.0, splitTimeSpans.get(2).getTo());

        assertEquals(175.0, splitTimeSpans.get(3).getFrom());
        assertEquals(200.0, splitTimeSpans.get(3).getTo());
    }

}