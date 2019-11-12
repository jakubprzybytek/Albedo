package jp.albedo.jeanmeeus.ephemeris.common;

import jp.albedo.common.Epoch;

public class OrbitElements {

    private Epoch epoch;

    private double eccentricity;

    private double semiMajorAxis;

    private double meanMotion;

    private double argumentOfPerihelion;

    private double longitudeOfAscendingNode;

    private double inclination;

    private double meanAnomalyEpoch;

    private double meanAnomalyAtEpoch;

    public OrbitElements(Epoch epoch, double eccentricity, double semiMajorAxis, double meanMotion, double argumentOfPerihelion, double longitudeOfAscendingNode, double inclination, double meanAnomalyEpoch, double meanAnomalyAtEpoch) {
        this.epoch = epoch;
        this.eccentricity = eccentricity;
        this.semiMajorAxis = semiMajorAxis;
        this.meanMotion = meanMotion;
        this.argumentOfPerihelion = argumentOfPerihelion;
        this.longitudeOfAscendingNode = longitudeOfAscendingNode;
        this.inclination = inclination;
        this.meanAnomalyEpoch = meanAnomalyEpoch;
        this.meanAnomalyAtEpoch = meanAnomalyAtEpoch;
    }

    public Epoch getEpoch() {
        return epoch;
    }

    public double getEccentricity() {
        return eccentricity;
    }

    public double getSemiMajorAxis() {
        return semiMajorAxis;
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

    public double getInclination() {
        return inclination;
    }

    public double getInclinationInRadians() {
        return Math.toRadians(inclination);
    }

    public double getMeanAnomalyEpoch() {
        return meanAnomalyEpoch;
    }

    public double getMeanMotion() {
        return meanMotion;
    }

    public double getMeanMotionInRadians() {
        return Math.toRadians(meanMotion);
    }

    public double getMeanAnomalyAtEpoch() {
        return meanAnomalyAtEpoch;
    }

    public double getMeanAnomalyAtEpochInRadians() {
        return Math.toRadians(meanAnomalyAtEpoch);
    }

    @Override
    public String toString() {
        return String.format("[Epoch=%s, e=%.3f, a=%.4fAU, n=%.4f, ω=%.3f°, Ω=%.3f°, i=%.4f°, T=%.4fTD, M=%.3f°]",
                this.epoch,
                this.eccentricity,
                this.semiMajorAxis,
                this.meanMotion,
                this.argumentOfPerihelion,
                this.longitudeOfAscendingNode,
                this.inclination,
                this.meanAnomalyEpoch,
                this.meanAnomalyAtEpoch);
    }

    public String toStringHighPrecision() {
        return String.format("[Epoch=%s, e=%.10f, a=%.10fAU, n=%.10f, ω=%.10f°, Ω=%.10f°, i=%.10f°, T=%.8fTD, M=%.6f°]",
                this.epoch,
                this.eccentricity,
                this.semiMajorAxis,
                this.meanMotion,
                this.argumentOfPerihelion,
                this.longitudeOfAscendingNode,
                this.inclination,
                this.meanAnomalyEpoch,
                this.meanAnomalyAtEpoch);
    }
}
