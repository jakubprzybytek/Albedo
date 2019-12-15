package jp.albedo.common;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import jp.albedo.utils.Formatter;
import jp.albedo.webapp.utils.RadiansToPrecision6DegreesSerializer;
import org.apache.commons.math3.util.MathUtils;

public class AstronomicalCoordinates {

    /**
     * In radians.
     */
    @JsonSerialize(using = RadiansToPrecision6DegreesSerializer.class)
    public double rightAscension;

    /**
     * In radians.
     */
    @JsonSerialize(using = RadiansToPrecision6DegreesSerializer.class)
    public double declination;

    /**
     * @param rightAscension Right Ascension in radians.
     * @param declination    Declination in radians.
     */
    public AstronomicalCoordinates(double rightAscension, double declination) {
        this.rightAscension = rightAscension;
        this.declination = declination;
    }

    static public AstronomicalCoordinates fromDegrees(double rightAscensionInDegrees, double declinationInDegrees) {
        return new AstronomicalCoordinates(Math.toRadians(rightAscensionInDegrees), Math.toRadians(declinationInDegrees));
    }

    public static AstronomicalCoordinates fromRectangular(RectangularCoordinates rectangular) {
        return new AstronomicalCoordinates(
                MathUtils.normalizeAngle(Math.atan2(rectangular.y, rectangular.x), Math.PI),
                Math.atan2(rectangular.z, Math.sqrt(rectangular.x * rectangular.x + rectangular.y * rectangular.y))
        );
    }

    /**
     * Returns delta between this coordinates and those provided as parameter. It is not an angular separation.
     *
     * @param other Subtract.
     * @return Delta coordinates.
     */
    public AstronomicalCoordinates subtract(AstronomicalCoordinates other) {
        return new AstronomicalCoordinates(
                this.rightAscension - other.rightAscension,
                this.declination - other.declination
        );
    }

    @Override
    public String toString() {
        return String.format("[α=%s (%f°), δ=%s (%f°)]",
                Formatter.HOUR_ANGLE.apply(this.rightAscension), Math.toDegrees(this.rightAscension),
                Formatter.DEGREES.apply(this.declination), Math.toDegrees(this.declination));
    }

    public String toStringHighResolution() {
        return String.format("[α=%s (%.10f°), δ=%s (%.10f°)]",
                Formatter.HOUR_ANGLE_HIGH_RESOLUTION.apply(this.rightAscension), Math.toDegrees(this.rightAscension),
                Formatter.DEGREES_HIGH_RESOLUTION.apply(this.declination), Math.toDegrees(this.declination));
    }

}
