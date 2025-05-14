export enum EclipseType {
    SunEclipse = 'SunEclipse',
    MoonEclipse = 'MoonEclipse'
}

export type Eclipse = {
    readonly type: EclipseType;
    readonly jde: number;
    readonly eventTimeRangeWidthSeconds: number;
    readonly tde: Date;
    readonly separation: number;
    readonly positionAngle: number;
};
