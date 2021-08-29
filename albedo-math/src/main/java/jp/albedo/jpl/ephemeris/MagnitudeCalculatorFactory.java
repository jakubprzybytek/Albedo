package jp.albedo.jpl.ephemeris;

import jp.albedo.common.BodyInformation;
import jp.albedo.common.magnitude.ApparentMagnitudeCalculator;
import jp.albedo.common.magnitude.MagnitudeParameters;
import jp.albedo.common.magnitude.MinorPlanetMagnitudeCalculator;
import jp.albedo.common.magnitude.PlanetsMagnitudeCalculator;
import jp.albedo.common.magnitude.StarMagnitudeCalculator;
import jp.albedo.jpl.JplBody;

public class MagnitudeCalculatorFactory {

    public static ApparentMagnitudeCalculator getFor(JplBody body) {
        if (JplBody.Sun == body) {
            return new StarMagnitudeCalculator(BodyInformation.Sun.absoluteMagnitude);
        }
        if (JplBody.Pluto == body) {
            return new MinorPlanetMagnitudeCalculator(new MagnitudeParameters(-4.45, 0.15));
        } else {
            return new PlanetsMagnitudeCalculator(body);
        }
    }

}
