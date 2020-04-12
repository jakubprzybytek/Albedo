package jp.albedo.jeanmeeus.topocentric;

public class RiseSet {

    public final double risingTime;

    public final double risingAzimuth;

    public final double settingTime;

    public final double settingAzimuth;

    public RiseSet(double risingTime, double risingAzimuth, double settingTime, double settingAzimuth) {
        this.risingTime = risingTime;
        this.risingAzimuth = risingAzimuth;
        this.settingTime = settingTime;
        this.settingAzimuth = settingAzimuth;
    }

}
