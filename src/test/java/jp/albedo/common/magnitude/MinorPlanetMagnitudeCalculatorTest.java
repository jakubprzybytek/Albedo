package jp.albedo.common.magnitude;

import jp.albedo.jeanmeeus.ephemeris.common.RectangularCoordinates;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;

class MinorPlanetMagnitudeCalculatorTest {

    @Test
    void compute() {
        MagnitudeParameters magnitudeParameters = new MagnitudeParameters(10.0, 2.0);
        MinorPlanetMagnitudeCalculator magnitudeCalculator = new MinorPlanetMagnitudeCalculator(magnitudeParameters);

        RectangularCoordinates heliocentricCoords = new RectangularCoordinates(1.0, 0.0, 0.0);
        RectangularCoordinates geocentricCoords = new RectangularCoordinates(0.0, 1.0, 0.0);

        assertEquals(11.41, magnitudeCalculator.compute(heliocentricCoords, geocentricCoords));
    }
}