export class Radians {
    static fromDegrees(degrees: number): number {
        return degrees * Math.PI / 180;
    }

    static toDegrees(radians: number): number {
        return radians * 180 / Math.PI;
    }
}