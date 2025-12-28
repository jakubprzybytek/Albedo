import { Radians } from "@astro/coords";

const FIELDS_TO_TRANSFORM = ['rightAscension', 'declination', 'azimuth', 'altitude',
    'separation', 'angularSize', 'umbraAngularSize', 'penumbraAngularSize', 'majorAxis', 'minorAxis', 'positionAngle']

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function anglesReplacer(this: any, key: string, value: any): any {
    if (FIELDS_TO_TRANSFORM.includes(key)) {
        const angle = value as number;
        return Radians.toDegrees(angle);
    }
    return value;
}
