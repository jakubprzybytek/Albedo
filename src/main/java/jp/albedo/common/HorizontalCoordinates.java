package jp.albedo.common;

import org.apache.commons.math3.util.MathUtils;

public class HorizontalCoordinates {

    /**
     * Azimuth Eastward from North.
     */
    public final double azimuth;

    /**
     * Altitude.
     */
    public final double altitude;

    public HorizontalCoordinates(double azimuth, double altitude) {
        this.azimuth = azimuth;
        this.altitude = altitude;
    }

    public static HorizontalCoordinates forObserver(double declination, double localHourAngle, double latitude) {
        final double azimuth = Math.atan2(Math.sin(localHourAngle), Math.cos(localHourAngle) * Math.sin(latitude) - Math.tan(declination) * Math.cos(latitude));
        return new HorizontalCoordinates(
                MathUtils.normalizeAngle(azimuth + Math.PI, Math.PI),
                Math.asin(Math.sin(latitude) * Math.sin(declination) + Math.cos(latitude) * Math.cos(declination) * Math.cos(localHourAngle))
        );
    }

}
