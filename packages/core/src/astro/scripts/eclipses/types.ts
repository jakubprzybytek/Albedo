export enum EclipseType {
    SunEclipse = 'SunEclipse',
    MoonEclipse = 'MoonEclipse'
}

export type Eclipse = {
    readonly type: EclipseType;
    readonly es: number;
    readonly jde: number;
    readonly tde: Date;
    readonly separation: number;
    readonly positionAngle: number;
};
