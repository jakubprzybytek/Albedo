import { average } from 'simple-statistics';
import { AstronomicalCoordinates, JulianDay, Radians } from '../../../math';
import { Ephemerides } from '../../../astro/ephemeris';
import { JplBodyId } from '../..';
import { AstronomicalCoordsData } from './WebGeocalcCSV';

type Stats = {
    separationAverage?: number;
    error?: any;
};

export function runAstronomicalCoordsTestCases(targetBodyId: JplBodyId, observerBodyId: JplBodyId, data: AstronomicalCoordsData[]): Stats {
    const stats: Stats = {};

    try {
        const separations = data.map((testCase) => {
            const jde = JulianDay.fromDateObject(testCase.tbd);
            const computedEphemeris = Ephemerides.simple(targetBodyId, jde, jde, 1)[0].coords;
            const expectedEphemeris = new AstronomicalCoordinates(Radians.fromDegrees(testCase.rightAscension), Radians.fromDegrees(testCase.declination));

            return Radians.separation(expectedEphemeris, computedEphemeris);
        })

        stats.separationAverage = average(separations);

    } catch (e: any) {
        stats.error = e;
    }

    return stats;
};
