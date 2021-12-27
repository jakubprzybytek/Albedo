package jp.albedo.webapp.ephemeris;

import jp.albedo.ephemeris.SimpleEphemeris;
import jp.albedo.jpl.JplException;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

public interface EphemeridesCalculator {

    Optional<List<SimpleEphemeris>> computeSimple(String bodyName, Double fromDate, Double toDate, double interval) throws JplException, IOException;

}
