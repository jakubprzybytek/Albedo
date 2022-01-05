package jp.albedo.webapp.ephemeris;

import jp.albedo.common.BodyDetails;
import jp.albedo.ephemeris.Ephemeris;
import jp.albedo.ephemeris.SimpleEphemeris;
import jp.albedo.jeanmeeus.topocentric.ObserverLocation;

import java.util.List;

public interface EphemeridesSolver {

    List<SimpleEphemeris> computeSimple(BodyDetails body, double fromDate, double toDate, double interval) throws EphemerisException;

    SimpleEphemeris computeSimple(BodyDetails body, double jde, ObserverLocation observerLocation) throws EphemerisException;

    List<SimpleEphemeris> computeSimple(BodyDetails body, double fromDate, double toDate, double interval, ObserverLocation observerLocation) throws EphemerisException;

    Ephemeris compute(BodyDetails body, double jde, ObserverLocation observerLocation) throws EphemerisException;

    List<Ephemeris> compute(BodyDetails body, double fromDate, double toDate, double interval, ObserverLocation observerLocation) throws EphemerisException;

}
