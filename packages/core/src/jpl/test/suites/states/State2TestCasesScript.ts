import { average } from 'simple-statistics';
import { RectangularCoordinates } from '@astro/coords';
import { EphemerisSeconds, JplBodyId } from '@jpl';
import { kernelRepository } from '@jpl/data/de440.full';
import { RectangularCoordsData } from '../../lib/WebGeocalcCSV';
import { States } from '@astro/scripts';
import { TestSuiteStats } from '.';

export function runState2TestCases(targetBodyId: JplBodyId, observerBodyId: JplBodyId, data: RectangularCoordsData[]): TestSuiteStats {

  const stats: TestSuiteStats = {};

  try {
    const stateScipts = new States(kernelRepository.stateSolver2());

    try {
      const positionDifferences = data.map(state => {
        const computedPosition = stateScipts.position(targetBodyId, observerBodyId, EphemerisSeconds.fromDateTimeObject(state.tbd));
        const expectedPosition = new RectangularCoordinates(state.x, state.y, state.z);

        return expectedPosition.subtract(computedPosition).length();
      });

      stats.positionDifferenceAverage = average(positionDifferences);
    } catch (e: any) {
      stats.positionComputationError = e;
    }

    try {
      const velocityDifferences = data.map(state => {
        const computedVelocity = stateScipts.velocity(targetBodyId, observerBodyId, EphemerisSeconds.fromDateTimeObject(state.tbd));
        const expectedVelocity = new RectangularCoordinates(state.speed_x, state.speed_y, state.speed_z);

        return expectedVelocity.subtract(computedVelocity).length();
      });

      stats.velocityDifferenceAverage = average(velocityDifferences);
    } catch (e: any) {
      stats.velocityComputationError = e;
    }
  } catch (e: any) {
    stats.positionComputationError = e;
    stats.velocityComputationError = e;
  }

  return stats;
};
