package jp.albedo.jpl.ephemeris;

import jp.albedo.common.BodyInformation;
import jp.albedo.common.BodyType;
import jp.albedo.common.magnitude.ApparentMagnitudeCalculator;
import jp.albedo.common.magnitude.MagnitudeParameters;
import jp.albedo.common.magnitude.MinorPlanetMagnitudeCalculator;
import jp.albedo.common.magnitude.PlanetsMagnitudeCalculator;
import jp.albedo.common.magnitude.StarMagnitudeCalculator;
import jp.albedo.jpl.JplBody;

import java.util.Optional;

public class MagnitudeCalculatorFactory {

    public static Optional<ApparentMagnitudeCalculator> getFor(JplBody body) {
        if (BodyType.Planet == body.bodyType) {
            return Optional.of(new PlanetsMagnitudeCalculator(body));
        }

        if (JplBody.Sun == body) {
            return Optional.of(new StarMagnitudeCalculator(BodyInformation.Sun.absoluteMagnitude));
        }
        if (JplBody.Pluto == body) {
            return Optional.of(new MinorPlanetMagnitudeCalculator(new MagnitudeParameters(-4.45, 0.15)));
        }

        return Optional.empty();
    }

}
