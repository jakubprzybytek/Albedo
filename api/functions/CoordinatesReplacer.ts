import { Radians } from "../math";

export function coordinatesReplacer(this: any, key: string, value: any): any {
    if (key === 'rightAscension' || key === 'declination') {
        const angle = value as number;
        return Radians.toDegrees(angle);
    }
    return value;
}
