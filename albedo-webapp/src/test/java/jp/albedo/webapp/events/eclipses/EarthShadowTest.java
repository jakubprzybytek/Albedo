package jp.albedo.webapp.events.eclipses;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;

public class EarthShadowTest {

    @Test
    void test() {
        assertEquals(4720.02, EarthShadow.umbra(385000, 150000000, 6500, 700000), 0.01);
        assertEquals(8313.35, EarthShadow.penumbra(385000, 150000000, 6500, 700000));
    }

}
