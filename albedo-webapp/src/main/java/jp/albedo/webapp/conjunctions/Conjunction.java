package jp.albedo.webapp.conjunctions;

import jp.albedo.ephemeris.Ephemeris;

public class Conjunction<A, B extends Object> {

    final public double jde;

    final public double separation;

    final public double separationFactor;

    final public A firstObject;

    final public Ephemeris firstObjectEphemeris;

    final public B secondObject;

    final public Ephemeris secondObjectEphemeris;

    public Conjunction(double jde, double separation, double separationFactor, A firstObject, Ephemeris firstObjectEphemeris, B secondObject, Ephemeris secondObjectEphemeris) {
        this.jde = jde;
        this.separation = separation;
        this.separationFactor = separationFactor;
        this.firstObject = firstObject;
        this.firstObjectEphemeris = firstObjectEphemeris;
        this.secondObject = secondObject;
        this.secondObjectEphemeris = secondObjectEphemeris;
    }
}