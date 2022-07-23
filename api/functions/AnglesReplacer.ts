import { Radians } from "../math";

export function anglesReplacer(this: any, key: string, value: any): any {
    if (key === 'rightAscension' || key === 'declination' || key === 'separation') {
        const angle = value as number;
        return Radians.toDegrees(angle);
    }
    return value;
}
