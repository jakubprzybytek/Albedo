import { Radians, RectangularCoordinates } from '.';

const TWO_PI = Math.PI * 2;

export class AzAltCoordinates {
    readonly azimuth: number; // radians
    readonly altitude: number; // radians

    /*
        Constructs AzAltCoordinates using radians.
    */
    constructor(azimuth: number, altitude: number) {
        this.azimuth = azimuth;
        this.altitude = altitude;
    }

    toDegrees(): AzAltCoordinates {
        return new AzAltCoordinates(Radians.toDegrees(this.azimuth), Radians.toDegrees(this.altitude));
    }

    static fromDegrees(azimuthDeg: number, altitudeDeg: number): AzAltCoordinates {
        return new AzAltCoordinates(Radians.fromDegrees(azimuthDeg), Radians.fromDegrees(altitudeDeg));
    }

    static fromRectangular(rectangular: RectangularCoordinates): AzAltCoordinates {
        return new AzAltCoordinates(
            this.normalizeAngle(Math.atan2(rectangular.y, rectangular.x)),
            Math.atan2(rectangular.z, Math.sqrt(rectangular.x * rectangular.x + rectangular.y * rectangular.y))
        );
    }

    private static normalizeAngle(angle: number): number {
        return angle - TWO_PI * Math.floor(angle / TWO_PI);
    }
}
