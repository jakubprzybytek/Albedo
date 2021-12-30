package jp.albedo.jpl.ephemeris;

import jp.albedo.ephemeris.Ephemeris;
import jp.albedo.jpl.JplException;

import java.util.Collections;
import java.util.List;

/**
 * JPL's Kernel based ephemerides calculator for main Solar System objects.
 */
public interface EphemeridesCalculator<T> {

    /**
     * Computes Earth based ephemeris for given body and for single time instant.
     *
     * @param jde Time instant.
     * @return
     * @throws JplException when cannot compute due to lack of coefficients or insufficient time coverage.
     */
    default T computeFor(double jde) throws JplException {
        return computeFor(Collections.singletonList(jde)).get(0);
    }

    /**
     * Computes Earth based ephemeris for given body and for multiple time instants.
     *
     * @param jdes Array of JDEs.
     * @return
     * @throws JplException when cannot compute due to lack of coefficients or insufficient time coverage.
     */
    List<T> computeFor(List<Double> jdes) throws JplException;

}
