package jp.albedo.testutils;

import jp.albedo.common.AstronomicalCoordinates;
import jp.albedo.common.RectangularCoordinates;
import jp.albedo.testutils.assertions.AstronomicalCoordinatesAssert;
import jp.albedo.testutils.assertions.RectangularCoordinatesAssert;

public class AlbedoAssertions {

    public static RectangularCoordinatesAssert assertThat(RectangularCoordinates actual) {
        return new RectangularCoordinatesAssert(actual);
    }

    public static AstronomicalCoordinatesAssert assertThat(AstronomicalCoordinates actual) {
        return new AstronomicalCoordinatesAssert(actual);
    }

}
