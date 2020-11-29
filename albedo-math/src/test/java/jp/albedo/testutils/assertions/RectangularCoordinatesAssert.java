package jp.albedo.testutils.assertions;

import jp.albedo.common.RectangularCoordinates;
import org.assertj.core.api.AbstractAssert;
import org.assertj.core.data.Offset;
import org.assertj.core.internal.Doubles;
import org.assertj.core.util.VisibleForTesting;
import org.junit.jupiter.api.Assertions;

public class RectangularCoordinatesAssert extends AbstractAssert<RectangularCoordinatesAssert, RectangularCoordinates> {

    @VisibleForTesting
    Doubles doubles = Doubles.instance();

    public RectangularCoordinatesAssert(RectangularCoordinates rectangularCoordinates) {
        super(rectangularCoordinates, RectangularCoordinatesAssert.class);
    }

    public RectangularCoordinatesAssert isEqualTo(RectangularCoordinates expected, Offset<Double> offset) {
        Assertions.assertAll(
                () -> doubles.assertIsCloseTo(info, actual.x, expected.x, offset),
                () -> doubles.assertIsCloseTo(info, actual.y, expected.y, offset),
                () -> doubles.assertIsCloseTo(info, actual.z, expected.z, offset));
        return myself;
    }

}
