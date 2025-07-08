import { JplBodyId } from "@jpl/JplBody";
import { RectangularCoordsData } from "@jpl/test/lib/WebGeocalcCSV";

export type TestSuiteStats = {
  positionDifferenceAverage?: number;
  positionComputationError?: string;
  velocityDifferenceAverage?: number;
  velocityComputationError?: string;
};

export type StateTestCaseRunner = (targetBodyId: JplBodyId, observerBodyId: JplBodyId, data: RectangularCoordsData[]) => TestSuiteStats;
