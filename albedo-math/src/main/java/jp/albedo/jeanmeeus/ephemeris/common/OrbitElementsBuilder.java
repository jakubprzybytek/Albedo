package jp.albedo.jeanmeeus.ephemeris.common;

import jp.albedo.common.Epoch;

public class OrbitElementsBuilder {

    private Epoch epoch;

    private double eccentricity;

    private Double semiMajorAxis;

    private double periapsis;

    private Double meanDailyMotion;

    private double longitudeOfAscendingNode;

    private double inclination;

    private double argumentOfPerihelion;

    private double meanAnomalyEpoch;

    private double meanAnomalyAtEpoch;

    private OrbitElementsBuilder orbitShape(double eccentricity, Double semiMajorAxis, double periapsis, Double meanDailyMotion) {
        this.eccentricity = eccentricity;
        this.semiMajorAxis = semiMajorAxis;
        this.periapsis = periapsis;
        this.meanDailyMotion = meanDailyMotion;
        return this;
    }

    public OrbitElementsBuilder orbitShapeUsingSemiMajorAxis(double eccentricity, double semiMajorAxis) {
        return orbitShape(eccentricity, semiMajorAxis, (1.0 - eccentricity) * semiMajorAxis, MeanMotion.fromSemiMajorAxis(semiMajorAxis));
    }

    public OrbitElementsBuilder orbitShapeUsingSemiMajorAxis(double eccentricity, double semiMajorAxis, double meanDailyMotion) {
        return orbitShape(eccentricity, semiMajorAxis, (1.0 - eccentricity) * semiMajorAxis, meanDailyMotion);
    }

    public OrbitElementsBuilder orbitShapeUsingPeriapsis(double eccentricity, double periapsis) {
        if (eccentricity < 1.0) {
            final double semiMajorAxis = periapsis / (1 - eccentricity);
            return orbitShape(eccentricity, semiMajorAxis, periapsis, MeanMotion.fromSemiMajorAxis(semiMajorAxis)
            );
        } else {
            return orbitShape(eccentricity, null, periapsis, null);
        }
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
                this.eccentricity, this.semiMajorAxis, this.periapsis, this.meanDailyMotion,
                this.argumentOfPerihelion, this.longitudeOfAscendingNode, this.inclination,
                this.meanAnomalyEpoch, this.meanAnomalyAtEpoch
        );
    }
}
