import { Radians, RectangularCoordinates } from './';

const TWO_PI = Math.PI * 2;

export class AstronomicalCoordinates {
    readonly rightAscension: number; // radians
    readonly declination: number; // radians

    /*
        Constructs AstronomicalCoordinates using radians.
    */
    constructor(rightAscension: number, declination: number) {
        this.rightAscension = rightAscension;
        this.declination = declination;
    }

    toDegrees(): AstronomicalCoordinates {
        return new AstronomicalCoordinates(Radians.toDegrees(this.rightAscension), Radians.toDegrees(this.declination));
    }

    static fromDegrees(rightAscensionInDegrees: number, declinationInDegrees: number): AstronomicalCoordinates {
        return new AstronomicalCoordinates(Radians.fromDegrees(rightAscensionInDegrees), Radians.fromDegrees(declinationInDegrees));
    }

    static fromRectangular(rectangular: RectangularCoordinates): AstronomicalCoordinates {
        return new AstronomicalCoordinates(
            this.normalizeAngle(Math.atan2(rectangular.y, rectangular.x)),
            Math.atan2(rectangular.z, Math.sqrt(rectangular.x * rectangular.x + rectangular.y * rectangular.y))
        );
    }

    private static normalizeAngle(angle: number): number {
        return angle - TWO_PI * Math.floor(angle / TWO_PI);
    }
}
