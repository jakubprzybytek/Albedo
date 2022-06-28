export * from './TimeSpan';
export * from './SpkKernelRepository';

import { JplBody } from '../JplBody';
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

export type SpkKernelCollection = {
    kernelFileName: string;
    body: JplBody;
    centerBody: JplBody;
    positionData: PositionChebyshevRecord[];
}
