package jp.albedo.testutils;

import jp.albedo.common.RectangularCoordinates;

public class AlbedoAssertions {

    public static RectangularCoordinatesAssert assertThat(RectangularCoordinates actual) {
        return new RectangularCoordinatesAssert(actual);
    }

}
