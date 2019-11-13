package jp.albedo.jpl;

import jp.albedo.jeanmeeus.ephemeris.Ephemeris;

import java.util.Collections;
import java.util.List;

/**
 * JPL's Kernel based ephemerides calculator for main Solar System objects.
 */
public interface EphemeridesCalculator {

    /**
     * Computes Earth based ephemeris for given body and for single time instant.
     *
     * @param jde Time instant.
     * @return
     * @throws JplException when cannot compute due to lack of coefficients or insufficient time coverage.
     */
    default Ephemeris computeEphemeridesForJds(double jde) throws JplException {
        return computeEphemeridesForJds(Collections.singletonList(jde)).get(0);
    }

    /**
     * Computes Earth based ephemeris for given body and for multiple time instants.
     *
     * @param jdes Array of JDEs.
     * @return
     * @throws JplException when cannot compute due to lack of coefficients or insufficient time coverage.
     */
    List<Ephemeris> computeEphemeridesForJds(List<Double> jdes) throws JplException;

}
