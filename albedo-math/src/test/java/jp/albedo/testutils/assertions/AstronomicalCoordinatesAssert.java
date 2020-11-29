package jp.albedo.testutils.assertions;

import jp.albedo.common.AstronomicalCoordinates;
import jp.albedo.testutils.Radians;
import org.assertj.core.api.AbstractAssert;
import org.assertj.core.data.Offset;
import org.assertj.core.internal.Failures;
import org.assertj.core.util.VisibleForTesting;

import static org.assertj.core.api.Assertions.within;

public class AstronomicalCoordinatesAssert extends AbstractAssert<AstronomicalCoordinatesAssert, AstronomicalCoordinates> {

    @VisibleForTesting
    final Failures failures = Failures.instance();

    final Offset<Double> rightAscensionOffset = within(Radians.ONE_HUNDREDTH_SECOND);

    final Offset<Double> declinationOffset = within(Radians.ONE_TENTH_ARCSECOND);

    public AstronomicalCoordinatesAssert(AstronomicalCoordinates astronomicalCoordinates) {
        super(astronomicalCoordinates, AstronomicalCoordinatesAssert.class);
    }

    public AstronomicalCoordinatesAssert isEqualTo(AstronomicalCoordinates expected) {
        if (expected.equals(actual)) {
            return myself;
        }

        final double rightAscensionDifference = expected.rightAscension - actual.rightAscension;
        final double declinationDifference = expected.declination - actual.declination;

        if (Math.abs(rightAscensionDifference) > rightAscensionOffset.value ||
                Math.abs(declinationDifference) > declinationOffset.value) {
            throw failures.failure(info, ShouldBeEqualWithinOffset.shouldBeEqual(actual, expected,
                    rightAscensionOffset, declinationOffset,
                    rightAscensionDifference, declinationDifference));
        }
        return myself;
    }

}
