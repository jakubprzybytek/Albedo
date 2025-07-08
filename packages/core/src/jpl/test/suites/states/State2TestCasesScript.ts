import { average } from 'simple-statistics';
import { RectangularCoordinates } from '@astro/coords';
import { EphemerisSeconds, JplBodyId } from '@jpl';
import { kernelRepository } from '@jpl/data/de440.full';
import { RectangularCoordsData } from '@jpl/test/lib/WebGeocalcCSV';
import { TestSuiteStats } from '.';
import { CorrectionType } from '@jpl/state/solver2';

export function buildState2TestCaseRunner(correction: CorrectionType) {
  return (targetBodyId: JplBodyId, observerBodyId: JplBodyId, data: RectangularCoordsData[]) => {
    return runState2TestCases(targetBodyId, observerBodyId, data, correction);
  }
}

export function runState2TestCases(targetBodyId: JplBodyId, observerBodyId: JplBodyId, data: RectangularCoordsData[], correction: CorrectionType): TestSuiteStats {

  const stats: TestSuiteStats = {};

  try {
    const stateSolver = kernelRepository.StateSolver();

    try {
      const differences = data.map(state => {
        const computedState = stateSolver.stateFor(targetBodyId, observerBodyId, EphemerisSeconds.fromDateTimeObject(state.tbd), correction);

        const expectedPosition = new RectangularCoordinates(state.x, state.y, state.z);
        const expectedVelocity = new RectangularCoordinates(state.speed_x, state.speed_y, state.speed_z);

        return [
          expectedPosition.subtract(computedState.position).length(),
          expectedVelocity.subtract(computedState.velocity).length()
        ];
      });

      const positionDifferences = differences.map(d => d[0]);
      const velocityDifferences = differences.map(d => d[1]);

      stats.positionDifferenceAverage = average(positionDifferences);
      stats.velocityDifferenceAverage = average(velocityDifferences);
    } catch (e) {
      stats.velocityComputationError = e as string;
    }
  } catch (e) {
    stats.positionComputationError = e as string;
    stats.velocityComputationError = e as string;
  }

  return stats;
};
