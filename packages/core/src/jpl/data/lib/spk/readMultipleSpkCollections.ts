import { openSync, closeSync } from 'node:fs';
import { JulianDay } from "@astro";
import { JplBodyId, EphemerisSeconds } from "@jpl";
import { PositionAndVelocityChebyshevRecord, PositionChebyshevRecord, SpkKernelCollection } from '@jpl/kernels/spk';
import { SpkFileArrayInformation, readSpkFileInformation, readSpkPositionChebyshevPolynomials, readSpkPositionAndVelocityChebyshevPolynomials, DataType } from '@jpl/kernels/spk/files';

type BodiesPair = {
  body: JplBodyId;
  centerBody: JplBodyId;
}

function readRecords(fd: number, spkFileArrayInformationList: SpkFileArrayInformation[], bodyId: JplBodyId, centerBodyId: JplBodyId, fromJde: number, toJde: number): SpkKernelCollection {
  const positionRecords: PositionChebyshevRecord[] = [];
  const positionAndVelocityRecords: PositionAndVelocityChebyshevRecord[] = [];

  spkFileArrayInformationList
    .filter(arrayInformation => arrayInformation.body.id === bodyId && arrayInformation.centerBody.id === centerBodyId)
    .forEach(arrayInformation => {
      switch (arrayInformation.dataType) {
        case DataType.ChebyshevPosition: {
          const newPRecords = readSpkPositionChebyshevPolynomials(fd, arrayInformation, EphemerisSeconds.fromJde(fromJde), EphemerisSeconds.fromJde(toJde));
          positionRecords.push(...newPRecords);
          break;
        }
        case DataType.ChebyshevPositionAndVelocity: {
          const newPVRecords = readSpkPositionAndVelocityChebyshevPolynomials(fd, arrayInformation, EphemerisSeconds.fromJde(fromJde), EphemerisSeconds.fromJde(toJde));
          positionAndVelocityRecords.push(...newPVRecords);
          break;
        }
      };
    })

  if (positionRecords.length === 0 && positionAndVelocityRecords.length === 0) {
    throw Error(`Cannot find records for body '${bodyId}' w.r.t. '${centerBodyId}'`);
  }

  return {
    kernelFileName: 'test',
    bodyId: bodyId,
    centerBodyId: centerBodyId,
    data: positionRecords.length > 0 ? positionRecords : positionAndVelocityRecords,
    dataType: positionRecords.length > 0 ? DataType.ChebyshevPosition : DataType.ChebyshevPositionAndVelocity
  }
}

export function readMultipleSpkCollections(spkFileName: string, from: Date, to: Date, bodies: BodiesPair[]): SpkKernelCollection[] {
  const fromJde = JulianDay.fromDateObject(from);
  const toJde = JulianDay.fromDateObject(to);

  const spkFd = openSync(spkFileName, 'r');

  try {
    const { spkFileArrayInformationList } = readSpkFileInformation(spkFd);

    const spkCollectionsList = bodies.map(pair => readRecords(spkFd, spkFileArrayInformationList, pair.body, pair.centerBody, fromJde, toJde))
    return spkCollectionsList;
  }
  catch (e: unknown) {
    throw new Error(`Error processing file: '${spkFileName}'`, { cause: e })
  }
  finally {
    closeSync(spkFd);
  }
}
