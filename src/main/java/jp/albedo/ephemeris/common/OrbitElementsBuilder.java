package jp.albedo.ephemeris.common;

import jp.albedo.common.Epoch;

public class OrbitElementsBuilder {

    private Epoch epoch;

    private double eccentricity;

    private double semiMajorAxis;

    private double meanDailyMotion;

    private double longitudeOfAscendingNode;

    private double inclination;

    private double argumentOfPerihelion;

    private double meanAnomalyEpoch;

    private double meanAnomalyAtEpoch;

    public OrbitElementsBuilder orbitShape(double eccentricity, double semiMajorAxis) {
        this.eccentricity = eccentricity;
        this.semiMajorAxis = semiMajorAxis;
        this.meanDailyMotion = MeanMotion.fromSemiMajorAxis(semiMajorAxis);
        return this;
    }

    public OrbitElementsBuilder orbitShape(double eccentricity, double semiMajorAxis, double meanDailyMotion) {
        this.eccentricity = eccentricity;
        this.semiMajorAxis = semiMajorAxis;
        this.meanDailyMotion = meanDailyMotion;
        return this;
    }

    public OrbitElementsBuilder orbitPosition(Epoch epoch, double argumentOfPerihelion, double longitudeOfAscendingNode, double inclination) {
        this.epoch = epoch;
        this.longitudeOfAscendingNode = longitudeOfAscendingNode;
        this.inclination = inclination;
        this.argumentOfPerihelion = argumentOfPerihelion;
        return this;
    }

    public OrbitElementsBuilder bodyPosition(double meanAnomalyEpoch, double meanAnomalyAtEpoch) {
        this.meanAnomalyEpoch = meanAnomalyEpoch;
        this.meanAnomalyAtEpoch = meanAnomalyAtEpoch;
        return this;
    }

    public OrbitElements build() {
        return new OrbitElements(this.epoch,
                this.eccentricity, this.semiMajorAxis, this.meanDailyMotion,
                this.argumentOfPerihelion, this.longitudeOfAscendingNode, this.inclination,
                this.meanAnomalyEpoch, this.meanAnomalyAtEpoch
        );
    }
}
