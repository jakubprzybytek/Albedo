package jp.albedo.jeanmeeus.topocentric;

import org.apache.commons.math3.util.MathUtils;

public class HorizontalCoordinates {

    /**
     * Azimuth Eastward from North in radians.
     */
    public final double azimuth;

    /**
     * Altitude in radians.
     */
    public final double altitude;

    public HorizontalCoordinates(double azimuth, double altitude) {
        this.azimuth = azimuth;
        this.altitude = altitude;
    }

    public static double getAzimuth(double declination, double localHourAngle, double latitude) {
        final double azimuth = Math.atan2(Math.sin(localHourAngle),
                Math.cos(localHourAngle) * Math.sin(latitude) - Math.tan(declination) * Math.cos(latitude));
        return MathUtils.normalizeAngle(azimuth + Math.PI, Math.PI);
    }

    public static double getAltitude(double declination, double localHourAngle, double latitude) {
        return Math.asin(Math.sin(latitude) * Math.sin(declination) + Math.cos(latitude) * Math.cos(declination) * Math.cos(localHourAngle));
    }

    public static HorizontalCoordinates forObserver(double declination, double localHourAngle, double latitude) {
        return new HorizontalCoordinates(
                getAzimuth(declination, localHourAngle, latitude),
                getAltitude(declination, localHourAngle, latitude));
    }

}
