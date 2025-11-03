import { Radians } from "@astro/coords";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function anglesReplacer(this: any, key: string, value: any): any {
    if (key === 'rightAscension' || key === 'declination' || key === 'separation' || key === 'angularSize') {
        const angle = value as number;
        return Radians.toDegrees(angle);
    }
    return value;
}
