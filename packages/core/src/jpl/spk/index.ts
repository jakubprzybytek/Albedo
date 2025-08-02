import { JplBodyId } from '@jpl';
import { TimeSpan } from './TimeSpan';
import { DataType } from './files';

export { SpkKernelRepository } from './SpkKernelRepository';
export { TimeSpan, DataType };

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
  data: PositionChebyshevRecord[] | PositionAndVelocityChebyshevRecord[];
  dataType: DataType;
}
