package jp.albedo.jpl.ephemeris;

import jp.albedo.common.BodyInformation;
import jp.albedo.jpl.JplBody;
import jp.albedo.jpl.ephemeris.impl.PlanetsMagnitudeCalculator;
import jp.albedo.jpl.ephemeris.impl.StarMagnitudeCalculator;

public class MagnitudeCalculatorFactory {

    public static ApparentMagnitudeCalculator getFor(JplBody body) {
        if (body == JplBody.Sun) {
            return new StarMagnitudeCalculator(BodyInformation.Sun.absoluteMagnitude);
        } else {
            return new PlanetsMagnitudeCalculator(body);
        }
    }

}
