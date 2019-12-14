package jp.albedo.jpl.ephemeris;

import jp.albedo.common.BodyInformation;
import jp.albedo.common.magnitude.ApparentMagnitudeCalculator;
import jp.albedo.jpl.JplBody;
import jp.albedo.common.magnitude.PlanetsMagnitudeCalculator;
import jp.albedo.common.magnitude.StarMagnitudeCalculator;

public class MagnitudeCalculatorFactory {

    public static ApparentMagnitudeCalculator getFor(JplBody body) {
        if (body == JplBody.Sun) {
            return new StarMagnitudeCalculator(BodyInformation.Sun.absoluteMagnitude);
        } else {
            return new PlanetsMagnitudeCalculator(body);
        }
    }

}
