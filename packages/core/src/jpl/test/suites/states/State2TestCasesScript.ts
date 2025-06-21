import { average } from 'simple-statistics';
import { RectangularCoordinates } from '@astro/coords';
import { EphemerisSeconds, JplBodyId } from '@jpl';
import { kernelRepository } from '@jpl/data/de440.full';
import { RectangularCoordsData } from '../../lib/WebGeocalcCSV';
import { States } from '@astro/scripts';
import { TestSuiteStats } from '.';
import { CorrectionType2 } from '@jpl/state/solver2';

export function buildState2TestCaseRunner(correction: CorrectionType2) {
  return (targetBodyId: JplBodyId, observerBodyId: JplBodyId, data: RectangularCoordsData[]) => {
    return runState2TestCases(targetBodyId, observerBodyId, data, correction);
  }
}

export function runState2TestCases(targetBodyId: JplBodyId, observerBodyId: JplBodyId, data: RectangularCoordsData[], correction: CorrectionType2): TestSuiteStats {

  const stats: TestSuiteStats = {};

  try {
    const stateScipts = new States(kernelRepository.stateSolver2());

    try {
      const positionDifferences = data.map(state => {
        const computedPosition = stateScipts.position(targetBodyId, observerBodyId, EphemerisSeconds.fromDateTimeObject(state.tbd), correction);
        const expectedPosition = new RectangularCoordinates(state.x, state.y, state.z);

        return expectedPosition.subtract(computedPosition).length();
      });

      stats.positionDifferenceAverage = average(positionDifferences);
    } catch (e) {
      stats.positionComputationError = e;
    }

    try {
      const velocityDifferences = data.map(state => {
        const computedVelocity = stateScipts.velocity(targetBodyId, observerBodyId, EphemerisSeconds.fromDateTimeObject(state.tbd));
        const expectedVelocity = new RectangularCoordinates(state.speed_x, state.speed_y, state.speed_z);

        return expectedVelocity.subtract(computedVelocity).length();
      });

      stats.velocityDifferenceAverage = average(velocityDifferences);
    } catch (e) {
      stats.velocityComputationError = e;
    }
  } catch (e) {
    stats.positionComputationError = e;
    stats.velocityComputationError = e;
  }

  return stats;
};
