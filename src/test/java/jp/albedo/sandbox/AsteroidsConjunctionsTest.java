package jp.albedo.sandbox;

import jp.albedo.common.AstronomicalCoordinates;
import jp.albedo.ephemeris.Ephemeris;
import org.apache.commons.math3.util.Pair;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;

class AsteroidsConjunctionsTest {

    @Test
    @DisplayName("Find conjunction on beginning of the list (ignore end the list)")
    void findEdgeConjunctions() {

        List<Ephemeris> ephemeris1 = Arrays.asList(
                new Ephemeris(1.0, new AstronomicalCoordinates(1.0, 2.0)),
                new Ephemeris(2.0, new AstronomicalCoordinates(2.0, 4.0)),
                new Ephemeris(3.0, new AstronomicalCoordinates(3.0, 3.0))
        );

        List<Ephemeris> ephemeris2 = Arrays.asList(
                new Ephemeris(1.0, new AstronomicalCoordinates(1.0, 1.0)),
                new Ephemeris(2.0, new AstronomicalCoordinates(2.0, 1.0)),
                new Ephemeris(3.0, new AstronomicalCoordinates(3.0, 1.0))
        );

        Pair<AsteroidsConjunctions.BodyData, AsteroidsConjunctions.BodyData> pair = new Pair<>(new AsteroidsConjunctions.BodyData(ephemeris1), new AsteroidsConjunctions.BodyData(ephemeris2));

        List<AsteroidsConjunctions.Conjunction> conjunctions = AsteroidsConjunctions.findConjunctions(pair);

        assertEquals(1, conjunctions.size());
        assertEquals(1.0, conjunctions.get(0).jde);
        assertEquals(1.0, conjunctions.get(0).separation);
    }

    @Test
    @DisplayName("Find two conjunctions")
    void findTwoConjunctions() {

        List<Ephemeris> ephemeris1 = Arrays.asList(
                new Ephemeris(1.0, new AstronomicalCoordinates(1.0, 3.0)),
                new Ephemeris(2.0, new AstronomicalCoordinates(2.0, 2.0)),
                new Ephemeris(3.0, new AstronomicalCoordinates(3.0, 4.0)),
                new Ephemeris(4.0, new AstronomicalCoordinates(4.0, 3.0)),
                new Ephemeris(5.0, new AstronomicalCoordinates(5.0, 5.0))
        );

        List<Ephemeris> ephemeris2 = Arrays.asList(
                new Ephemeris(1.0, new AstronomicalCoordinates(1.0, 1.0)),
                new Ephemeris(2.0, new AstronomicalCoordinates(2.0, 1.0)),
                new Ephemeris(3.0, new AstronomicalCoordinates(3.0, 1.0)),
                new Ephemeris(4.0, new AstronomicalCoordinates(4.0, 1.0)),
                new Ephemeris(5.0, new AstronomicalCoordinates(5.0, 1.0))
        );

        Pair<AsteroidsConjunctions.BodyData, AsteroidsConjunctions.BodyData> pair = new Pair<>(new AsteroidsConjunctions.BodyData(ephemeris1), new AsteroidsConjunctions.BodyData(ephemeris2));

        List<AsteroidsConjunctions.Conjunction> conjunctions = AsteroidsConjunctions.findConjunctions(pair);

        assertEquals(2, conjunctions.size());
        assertEquals(2.0, conjunctions.get(0).jde);
        assertEquals(1.0, conjunctions.get(0).separation);
        assertEquals(4.0, conjunctions.get(1).jde);
        assertEquals(2.0, conjunctions.get(1).separation);
    }
}