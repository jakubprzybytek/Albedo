package jp.albedo.webapp.ephemeris;

import jp.albedo.common.BodyDetails;
import jp.albedo.ephemeris.Ephemeris;
import jp.albedo.ephemeris.SimpleEphemeris;
import jp.albedo.jeanmeeus.topocentric.ObserverLocation;

import java.util.List;
import java.util.Optional;

public interface EphemeridesSolver {

    String getName();

    Optional<BodyDetails> parse(String bodyName);

    SimpleEphemeris computeSimple(BodyDetails body, double jde, ObserverLocation observerLocation) throws EphemerisException;

    List<SimpleEphemeris> computeSimple(BodyDetails body, double fromDate, double toDate, double interval, ObserverLocation observerLocation) throws EphemerisException;

    Ephemeris compute(BodyDetails body, double jde, ObserverLocation observerLocation) throws EphemerisException;

    List<Ephemeris> compute(BodyDetails body, double fromDate, double toDate, double interval, ObserverLocation observerLocation) throws EphemerisException;

}
