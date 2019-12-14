package jp.albedo.common.magnitude;

import jp.albedo.common.magnitude.StarMagnitudeCalculator;
import jp.albedo.jeanmeeus.ephemeris.common.RectangularCoordinates;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;

class StarMagnitudeCalculatorTest {

    @Test
    void compute() {
        StarMagnitudeCalculator magnitudeCalculator = new StarMagnitudeCalculator(4.83);
        RectangularCoordinates heliocentricCoords = new RectangularCoordinates(0.0, 0.0, 0.0);

        assertEquals(-26.79, magnitudeCalculator.compute(heliocentricCoords, new RectangularCoordinates(0.98, 0.0, 0.0)));
        assertEquals(-26.74, magnitudeCalculator.compute(heliocentricCoords, new RectangularCoordinates(1.0, 0.0, 0.0)));
        assertEquals(-26.70, magnitudeCalculator.compute(heliocentricCoords, new RectangularCoordinates(1.02, 0.0, 0.0)));
    }
}