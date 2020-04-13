package jp.albedo.jeanmeeus.ephemeris.common;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import jp.albedo.common.Epoch;
import jp.albedo.webapp.utils.Precision6Converter;

public class OrbitElements {

    final private Epoch epoch;

    final private double eccentricity;

    @JsonSerialize(converter = Precision6Converter.class)
    final private Double semiMajorAxis;

    final private double periapsis;

    final private Double meanMotion;

    final private double argumentOfPerihelion;

    final private double longitudeOfAscendingNode;

    final private double inclination;

    final private double meanAnomalyEpoch;

    final private double meanAnomalyAtEpoch;

    public OrbitElements(Epoch epoch, double eccentricity, Double semiMajorAxis, double periapsis, Double meanMotion, double argumentOfPerihelion, double longitudeOfAscendingNode, double inclination, double meanAnomalyEpoch, double meanAnomalyAtEpoch) {
        this.epoch = epoch;
        this.eccentricity = eccentricity;
        this.semiMajorAxis = semiMajorAxis;
        this.periapsis = periapsis;
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

    public Double getSemiMajorAxis() {
        return semiMajorAxis;
    }

    public double getPeriapsis() {
        return this.periapsis;
    }

    @JsonProperty
    @JsonSerialize(converter = Precision6Converter.class)
    public Double getApoapsis() {
        return this.semiMajorAxis != null ? (1.0 + this.eccentricity) * this.semiMajorAxis : null;
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

    public Double getMeanMotion() {
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
        return String.format("[Epoch=%s, e=%.3f, a=%.4fAU, n=%.4f°, ω=%.3f°, Ω=%.3f°, i=%.4f°, T=%.4fTD, M=%.3f°]",
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
        return String.format("[Epoch=%s, e=%.10f, a=%.10fAU, n=%.10f°, ω=%.10f°, Ω=%.10f°, i=%.10f°, T=%.8fTD, M=%.6f°]",
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
