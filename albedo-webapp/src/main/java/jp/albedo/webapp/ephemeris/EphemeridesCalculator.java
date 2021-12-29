package jp.albedo.webapp.ephemeris;

import jp.albedo.common.BodyDetails;
import jp.albedo.ephemeris.Ephemeris;
import jp.albedo.ephemeris.SimpleEphemeris;

import java.util.List;

public interface EphemeridesCalculator {

    List<SimpleEphemeris> computeSimple(BodyDetails body, Double fromDate, Double toDate, double interval) throws EphemerisException;

    List<Ephemeris> compute(BodyDetails body, Double fromDate, Double toDate, double interval) throws EphemerisException;

}
