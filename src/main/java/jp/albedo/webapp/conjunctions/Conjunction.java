package jp.albedo.webapp.conjunctions;

import jp.albedo.ephemeris.Ephemeris;

public class Conjunction<A, B extends Object> {

    final public double jde;

    final public double separation;

    final public A firstObject;

    final public Ephemeris firstObjectEphemeris;

    final public B secondObject;

    final public Ephemeris secondObjectEphemeris;

    public Conjunction(double jde, double separation, A firstObject, Ephemeris firstObjectEphemeris, B secondObject, Ephemeris secondObjectEphemeris) {
        this.jde = jde;
        this.separation = separation;
        this.firstObject = firstObject;
        this.firstObjectEphemeris = firstObjectEphemeris;
        this.secondObject = secondObject;
        this.secondObjectEphemeris = secondObjectEphemeris;
    }
}