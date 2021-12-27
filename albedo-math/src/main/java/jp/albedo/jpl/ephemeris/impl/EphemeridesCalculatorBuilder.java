package jp.albedo.jpl.ephemeris.impl;

public class EphemeridesCalculatorBuilder {

    private boolean magnitudeCalculator = false;

    public EphemeridesCalculatorBuilder() {

    }

    public void enableMagnitudeCalculator() {
        this.magnitudeCalculator = true;
    }

    void buildSimpleEphemeridesCalculator() {

    }
}
