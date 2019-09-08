package jp.astro.ephemeris.common;

import jp.astro.common.Epoch;

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

    public OrbitElementsBuilder orbitPosition(Epoch epoch, double longitudeOfAscendingNode, double inclination, double argumentOfPerihelion) {
        this.epoch = epoch;
        this.longitudeOfAscendingNode = longitudeOfAscendingNode;
        this.inclination = inclination;
        this.argumentOfPerihelion = argumentOfPerihelion;
        return this;
    }

    public OrbitElementsBuilder bodyPosition(double meanAnomalyEpoch, double meanAnomaly) {
        this.meanAnomalyEpoch = meanAnomalyEpoch;
        this.meanAnomalyAtEpoch = meanAnomaly;
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
