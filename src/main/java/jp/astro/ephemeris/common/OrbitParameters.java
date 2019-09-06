package jp.astro.ephemeris.common;

import jp.astro.common.Epoch;

public class OrbitParameters {

    private Epoch epoch;

    private double semiMajorAxis;

    private double eccentricity;

    private double inclination;

    private double argumentOfPerihelion;

    private double longitudeOfAscendingNode;

    private double time;

    public OrbitParameters(Epoch epoch, double semiMajorAxis, double eccentricity, double inclination, double argumentOfPerihelion, double longitudeOfAscendingNode, double time) {
        this.epoch = epoch;
        this.semiMajorAxis = semiMajorAxis;
        this.eccentricity = eccentricity;
        this.inclination = inclination;
        this.argumentOfPerihelion = argumentOfPerihelion;
        this.longitudeOfAscendingNode = longitudeOfAscendingNode;
        this.time = time;
    }

    public Epoch getEpoch() {
        return epoch;
    }

    public double getSemiMajorAxis() {
        return semiMajorAxis;
    }

    public double getEccentricity() {
        return eccentricity;
    }

    public double getInclination() {
        return inclination;
    }

    public double getInclinationInRadians() {
        return Math.toRadians(inclination);
    }

    public double getArgumentOfPerihelion() {
        return argumentOfPerihelion;
    }

    public double getArgumentOfPerihelionInRadians() {
        return Math.toRadians(argumentOfPerihelion);
    }

    public double getLongitudeOfAscendingNode() {
        return longitudeOfAscendingNode;
    }

    public double getLongitudeOfAscendingNodeInRadians() {
        return Math.toRadians(longitudeOfAscendingNode);
    }

    public double getTime() {
        return time;
    }

    @Override
    public String toString() {
        return String.format("[Epoch=%s, a=%.4f, e=%.3f, i=%.4f, Ω=%.3f°, ω=%.3f°, T=%.3fTD]",
                this.epoch,
                this.semiMajorAxis,
                this.eccentricity,
                this.inclination,
                this.longitudeOfAscendingNode,
                this.argumentOfPerihelion,
                this.time);
    }
}
