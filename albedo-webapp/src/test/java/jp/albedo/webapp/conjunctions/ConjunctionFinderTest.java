package jp.albedo.webapp.conjunctions;

import jp.albedo.catalogue.CatalogueEntry;
import jp.albedo.common.AstronomicalCoordinates;
import jp.albedo.common.BodyDetails;
import jp.albedo.common.ephemeris.Ephemeris;
import jp.albedo.webapp.ephemeris.ComputedEphemeris;
import org.apache.commons.math3.util.Pair;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;

class ConjunctionFinderTest {

    @Test
    @DisplayName("Find conjunction on beginning of the list (ignore end the list)")
    void findEdgeConjunctions() {

        List<Ephemeris> ephemeris1 = Arrays.asList(
                new Ephemeris(1.0, coords(1.0, 2.0), 2.0, 1.0, 0.0, 0.0),
                new Ephemeris(2.0, coords(2.0, 4.0), 2.0, 1.0, 0.0, 0.0),
                new Ephemeris(3.0, coords(3.0, 3.0), 2.0, 1.0, 0.0, 0.0)
        );

        List<Ephemeris> ephemeris2 = Arrays.asList(
                new Ephemeris(1.0, coords(1.0, 1.0), 2.0, 1.0, 0.0, 0.0),
                new Ephemeris(2.0, coords(2.0, 1.0), 2.0, 1.0, 0.0, 0.0),
                new Ephemeris(3.0, coords(3.0, 1.0), 2.0, 1.0, 0.0, 0.0)
        );

        Pair<ComputedEphemeris, ComputedEphemeris> pair = new Pair<>(
                new ComputedEphemeris(null, ephemeris1),
                new ComputedEphemeris(null, ephemeris2));

        List<Conjunction<BodyDetails, BodyDetails>> conjunctions = ConjunctionFinder.findConjunctionsBetweenTwoBodies(pair);

        assertEquals(1, conjunctions.size());
        assertEquals(1.0, conjunctions.get(0).jde);
        assertEquals(Math.toRadians(1.0), conjunctions.get(0).separation);
    }

    @Test
    @DisplayName("Find two conjunctions")
    void findTwoConjunctions() {

        List<Ephemeris> ephemeris1 = Arrays.asList(
                new Ephemeris(1.0, coords(1.0, 3.0), 2.0, 1.0, 0.0, 0.0),
                new Ephemeris(2.0, coords(2.0, 2.0), 2.0, 1.0, 0.0, 0.0),
                new Ephemeris(3.0, coords(3.0, 4.0), 2.0, 1.0, 0.0, 0.0),
                new Ephemeris(4.0, coords(4.0, 3.0), 2.0, 1.0, 0.0, 0.0),
                new Ephemeris(5.0, coords(5.0, 5.0), 2.0, 1.0, 0.0, 0.0)
        );

        List<Ephemeris> ephemeris2 = Arrays.asList(
                new Ephemeris(1.0, coords(1.0, 1.0), 2.0, 1.0, 0.0, 0.0),
                new Ephemeris(2.0, coords(2.0, 1.0), 2.0, 1.0, 0.0, 0.0),
                new Ephemeris(3.0, coords(3.0, 1.0), 2.0, 1.0, 0.0, 0.0),
                new Ephemeris(4.0, coords(4.0, 1.0), 2.0, 1.0, 0.0, 0.0),
                new Ephemeris(5.0, coords(5.0, 1.0), 2.0, 1.0, 0.0, 0.0)
        );

        Pair<ComputedEphemeris, ComputedEphemeris> pair = new Pair<>(
                new ComputedEphemeris(null, ephemeris1),
                new ComputedEphemeris(null, ephemeris2));

        List<Conjunction<BodyDetails, BodyDetails>> conjunctions = ConjunctionFinder.findConjunctionsBetweenTwoBodies(pair);

        assertEquals(2, conjunctions.size());
        assertEquals(2.0, conjunctions.get(0).jde);
        assertEquals(Math.toRadians(1.0), conjunctions.get(0).separation);
        assertEquals(4.0, conjunctions.get(1).jde);
        assertEquals(Math.toRadians(2.0), conjunctions.get(1).separation, 0.00000000000000001);
    }


    @Test
    @DisplayName("Find conjunction between moving body and catalogue entry")
    void findConjunctionsForBodyAndCatalogue() {

        List<Ephemeris> ephemeris1 = Arrays.asList(
                new Ephemeris(1.0, coords(1.0, 1.0), 2.0, 1.0, 0.0, 0.0),
                new Ephemeris(2.0, coords(2.0, 1.0), 2.0, 1.0, 0.0, 0.0),
                new Ephemeris(3.0, coords(3.0, 1.0), 2.0, 1.0, 0.0, 0.0)
        );

        final AstronomicalCoordinates catalogueEntryCoords = coords(2.0, 2.0);

        Pair<ComputedEphemeris, CatalogueEntry> pair = new Pair<>(
                new ComputedEphemeris(null, ephemeris1),
                new CatalogueEntry(null, null, catalogueEntryCoords, 0.0, 0.0, 0.0, 0.0, null));

        List<Conjunction<BodyDetails, CatalogueEntry>> conjunctions = ConjunctionFinder.findConjunctionsBetweenBodyAndCatalogueEntry(pair);

        assertEquals(1, conjunctions.size());
        assertEquals(2.0, conjunctions.get(0).jde);
        assertEquals(Math.toRadians(1.0), conjunctions.get(0).separation);
    }

    private AstronomicalCoordinates coords(double ra, double d) {
        return new AstronomicalCoordinates(Math.toRadians(ra), Math.toRadians(d));
    }
}