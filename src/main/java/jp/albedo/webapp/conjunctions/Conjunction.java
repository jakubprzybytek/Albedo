package jp.albedo.webapp.conjunctions;

public class Conjunction<A, B> {

    final public double jde;

    final public double separation;

    final public A first;

    final public B second;

    public Conjunction(double jde, double separation, A first, B second) {
        this.jde = jde;
        this.separation = separation;
        this.first = first;
        this.second = second;
    }
}