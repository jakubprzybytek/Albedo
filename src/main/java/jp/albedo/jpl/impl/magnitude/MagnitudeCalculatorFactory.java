package jp.albedo.jpl.impl.magnitude;

import jp.albedo.common.BodyInformation;
import jp.albedo.jpl.JplBody;

public class MagnitudeCalculatorFactory {

    public static ApparentMagnitudeCalculator getFor(JplBody body) {
        if (body == JplBody.Sun) {
            return new StarMagnitudeCalculator(BodyInformation.Sun.absoluteMagnitude);
        } else {
            return new PlanetsMagnitudeCalculator(body);
        }
    }

}
