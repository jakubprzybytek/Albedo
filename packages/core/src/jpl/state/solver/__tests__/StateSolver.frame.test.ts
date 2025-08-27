import { describe, it, expect } from "vitest";
import { EphemerisSeconds, JplBodyId, Vector3 } from '@jpl';
import { kernels } from "@jpl/data/kernels.testData";
import { CorrectionType } from "@jpl/state";
import { RotationMatrix } from "@jpl/frames/RotationMatrix";

describe("StateSolver", () => {

  const stateSolver = kernels.stateSolver();

  const bodyFixedFrame = kernels.bodyFixedFrame();

  it("should correctly compute state for Moon wrt. Earth", () => {
    const es = EphemerisSeconds.fromDate(2019, 10, 9);

    const position = stateSolver.positionFor(JplBodyId.Moon, JplBodyId.Earth, es, CorrectionType.NONE);

    expect(position.x).approximately(317255.79483133, 1e-9);
    expect(position.y).approximately(-220341.79779477, 2e-9);
    expect(position.z).approximately(-119833.86746624, 1e-9);

    const rotationMatrix = bodyFixedFrame.getRotationMatrix(JplBodyId.Earth, es);

    const positionVector: Vector3 = [position.x, position.y, position.z];
    // const positionVector: Vector3 = [317255.79483133, -220341.79779477, -119833.86746624];
    const bodyFixedPosition = RotationMatrix.multiplyVector(rotationMatrix, positionVector);

    expect(bodyFixedPosition[0]).approximately(240699.17507517, 2e-6);
    expect(bodyFixedPosition[1]).approximately(-302343.65321879, 2e-6);
    expect(bodyFixedPosition[2]).approximately(-119223.00733439, 1e-6);
  });

});
