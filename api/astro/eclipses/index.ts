export * from './Eclipses';

export type Eclipse = {
    readonly jde: number;
    readonly tde: Date;
    readonly separation: number;
    readonly positionAngle: number;
};