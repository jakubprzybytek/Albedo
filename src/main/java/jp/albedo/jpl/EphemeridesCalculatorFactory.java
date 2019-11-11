package jp.albedo.jpl;

import jp.albedo.jpl.impl.ephemeris.BarycenterReferencedBodiesEphemeridesCalculator;
import jp.albedo.jpl.impl.ephemeris.MoonEphemeridesCalculator;

public class EphemeridesCalculatorFactory {

    public static EphemeridesCalculator getFor(JplBody body, SPKernel spKernel) {
        if (body == JplBody.Moon) {
            return new MoonEphemeridesCalculator(spKernel);
        }
        return new BarycenterReferencedBodiesEphemeridesCalculator(spKernel);
    }


}
