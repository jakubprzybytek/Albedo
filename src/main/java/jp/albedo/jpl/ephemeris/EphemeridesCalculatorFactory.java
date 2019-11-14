package jp.albedo.jpl.ephemeris;

import jp.albedo.jpl.JplBody;
import jp.albedo.jpl.JplException;
import jp.albedo.jpl.SPKernel;
import jp.albedo.jpl.ephemeris.impl.BarycenterReferencedBodiesEphemeridesCalculator;
import jp.albedo.jpl.ephemeris.impl.MoonEphemeridesCalculator;

public class EphemeridesCalculatorFactory {

    public static EphemeridesCalculator getFor(JplBody body, SPKernel spKernel) throws JplException {
        if (body == JplBody.Moon) {
            return new MoonEphemeridesCalculator(spKernel);
        }
        return new BarycenterReferencedBodiesEphemeridesCalculator(body, spKernel);
    }


}
