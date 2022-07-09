export * from './TimeSpan';
export * from './SpkKernelRepository';

import { JplBodyId } from '../JplBody';
import { TimeSpan } from './';

export * from './TimeSpan';
export * from './SpkKernelRepository';

export type XYZCoefficients = {
    x: number[];
    y: number[];
    z: number[];
}

export type PositionChebyshevRecord = {
    timeSpan: TimeSpan;
    positionCoefficients: XYZCoefficients;
}

export type PositionAndVelocityChebyshevRecord = {
    timeSpan: TimeSpan;
    positionCoefficients: XYZCoefficients;
    velocityCoefficients: XYZCoefficients;
}

export type SpkKernelCollection = {
    kernelFileName: string;
    bodyId: JplBodyId;
    centerBodyId: JplBodyId;
    positionData: PositionChebyshevRecord[];
}
