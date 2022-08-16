import { AstronomicalCoordinates, RectangularCoordinates } from "./";

export class Radians {
    static fromDegrees(degrees: number): number {
        return degrees * Math.PI / 180;
    }

    static toDegrees(radians: number): number {
        return radians * 180 / Math.PI;
    }

    /**
     * Returns radians from hour angle.
     *
     * @param hours
     * @param minutes
     * @param seconds
     * @return
     */
    static fromHours(hours: number, minutes: number, seconds: number): number {
        return Radians.fromDegrees((hours + minutes / 60.0 + (seconds / 3600.0)) * 15.0);
    }

    /**
     * Returns radians from degrees, arc minutes and arc seconds.
     *
     * @param degrees
     * @param arcMinutes
     * @param arcSeconds
     * @return
     */
    static fromDegrees2(degrees: number, arcMinutes: number, arcSeconds: number): number {
        return degrees >= 0.0 ? Radians.fromDegrees(degrees + arcMinutes / 60.0 + arcSeconds / 3600.0)
            : Radians.fromDegrees(degrees - arcMinutes / 60.0 - arcSeconds / 3600.0);
    }

    /**
     * Angular separation over great circle.
     *
     * @param first  First coords.
     * @param second Second coords.
     * @return Separation in radians.
     */
    static separation(first: AstronomicalCoordinates, second: AstronomicalCoordinates): number {
        const x = Math.cos(first.declination) * Math.sin(second.declination)
            - Math.sin(first.declination) * Math.cos(second.declination) * Math.cos(second.rightAscension - first.rightAscension);
        const y = Math.cos(second.declination) * Math.sin(second.rightAscension - first.rightAscension);
        const z = Math.sin(first.declination) * Math.sin(second.declination)
            + Math.cos(first.declination) * Math.cos(second.declination) * Math.cos(second.rightAscension - first.rightAscension);
        return Math.atan2(Math.sqrt(x * x + y * y), z);
    }

    /**
     * Computes angle between two vectors defined as RectangularCoordinates.
     *
     * @param first  First vector.
     * @param second Second vector.
     * @return Angle between two vectors in radians.
     */
    static between(first: RectangularCoordinates, second: RectangularCoordinates): number {
        return Math.acos((first.x * second.x + first.y * second.y + first.z * second.z) / (first.length() * second.length()));
    }
}