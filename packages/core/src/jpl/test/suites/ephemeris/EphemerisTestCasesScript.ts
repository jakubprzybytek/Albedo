import { average } from 'simple-statistics';
import { AstronomicalCoordinates, Radians } from '@astro/coords';
import { Ephemerides } from '@astro/scripts';
import { EphemerisSeconds, JplBodyId } from '@jpl';
import { kernelRepository } from '@jpl/data/de440.full';
import { AstronomicalCoordsData } from '../../lib/WebGeocalcCSV';

type Stats = {
  separationAverage?: number;
  error?: any;
};

export function runEphemerisTestCases(targetBodyId: JplBodyId, observerBodyId: JplBodyId, data: AstronomicalCoordsData[]): Stats {
  const epherisScripts = new Ephemerides(kernelRepository.StateSolver());
  
  const stats: Stats = {};

  try {
    const separations = data.map((testCase) => {
      const es = EphemerisSeconds.fromDateTimeObject(testCase.tbd);
      const computedEphemeris = epherisScripts.single(targetBodyId, es);
      const expectedEphemeris = new AstronomicalCoordinates(Radians.fromDegrees(testCase.rightAscension), Radians.fromDegrees(testCase.declination));

      return Radians.separation(expectedEphemeris, computedEphemeris);
    })

    stats.separationAverage = average(separations);

  } catch (e: any) {
    stats.error = e;
  }

  return stats;
};
