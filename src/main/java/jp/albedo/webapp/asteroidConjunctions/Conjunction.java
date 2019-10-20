package jp.albedo.webapp.asteroidConjunctions;

import jp.albedo.webapp.ephemeris.ComputedEphemerides;

public class Conjunction {

    final public double jde;

    final public double separation;

    final public ComputedEphemerides first;

    final public ComputedEphemerides second;

    public Conjunction(double jde, double separation, ComputedEphemerides first, ComputedEphemerides second) {
        this.jde = jde;
        this.separation = separation;
        this.first = first;
        this.second = second;
    }
}