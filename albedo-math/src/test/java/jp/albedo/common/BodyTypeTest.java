package jp.albedo.common;

import org.junit.jupiter.api.Test;

import java.util.Arrays;
import java.util.Collections;
import java.util.HashSet;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

class BodyTypeTest {

    @Test
    void parseEmpty() {
        assertTrue(BodyType.parse(Collections.emptySet()).isEmpty());
    }

    @Test
    void parse() {
        Set<BodyType> expected = new HashSet<>(Arrays.asList(BodyType.Planet, BodyType.Star, BodyType.NaturalSatellite, BodyType.Asteroid));
        Set<String> bodyTypeStrings = new HashSet<>(Arrays.asList("Planet", "Star", "NaturalSatellite", "Asteroid"));
        assertEquals(expected, BodyType.parse(bodyTypeStrings));
    }
}