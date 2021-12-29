package jp.albedo.webapp.conjunctions;

import jp.albedo.ephemeris.SimpleEphemeris;

public class Conjunction2 {

    final public double jde;

    final public double separation;

    final public SimpleEphemeris firstBodyEphemeris;

    final public SimpleEphemeris secondBodyEphemeris;

    public Conjunction2(double jde, double separation, SimpleEphemeris firstObjectEphemeris, SimpleEphemeris secondObjectEphemeris) {
        this.jde = jde;
        this.separation = separation;
        this.firstBodyEphemeris = firstObjectEphemeris;
        this.secondBodyEphemeris = secondObjectEphemeris;
    }
}