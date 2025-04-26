import { JplBody } from "../";

export * from './LittleEndianByteBufferReader';
export * from './SpkFileInformationReader';
export * from './SpkFilePositionChebyshevPolynomialsReader';
export * from './SpkFilePositionAndVelocityChebyshevPolynomialsReader';

export enum FileArchitecture {
    DAF_SPK = 'DAF/SPK'
}

export enum DataType {
    ChebyshevPosition = 2,
    ChebyshevPositionAndVelocity = 3
};

const dataTypesById: { [key: number]: DataType } = {
    2: DataType.ChebyshevPosition,
    3: DataType.ChebyshevPositionAndVelocity
}

export function dataTypeFromId(id: number): DataType | undefined {
    return dataTypesById[id];
};

export enum ReferenceFrame {
    J2000 = 1
};

export function referenceFrameFromId(id: number): ReferenceFrame | undefined {
    return id === 1 ? ReferenceFrame.J2000 : undefined;
}

export const FILE_BLOCK_SIZE = 1024;

export const SPK_DOUBLE_SIZE = 8;

export const FILE_DESCRIPTOR_SIZE = 88;

export type SpkFileDescriptor = {
    architecture: string;
    fileRecordDoublesNumber: number;
    fileRecordIntegersNumber: number;
    fileName: string;
    firstArrayInformationBlockIndex: number;
    lastArrayInformationBlockIndex: number;
    freeDoubleIndex: number;
};

export type SpkFileArrayInformation = {
    startDate: number;
    endDate: number;
    body: JplBody;
    centerBody: JplBody;
    referenceFrame: ReferenceFrame;
    dataType: DataType;
    startIndex: number;
    endIndex: number;
};
