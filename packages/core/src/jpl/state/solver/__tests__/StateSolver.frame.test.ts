import { describe, it, expect } from "vitest";
import { Matrix3x3, Vector3 } from "@astro/math";
import { EphemerisSeconds, JplBodyId } from '@jpl';
import { kernels } from "@jpl/data/kernels.testData";
import { CorrectionType } from "@jpl/state";
import { RotationMatrix } from "@jpl/frames/RotationMatrix";

describe("StateSolver", () => {

  const stateSolver = kernels.stateSolver();

  const bodyFixedFrame = kernels.bodyFixedFrame();

  it("should correctly compute state for Moon wrt. Earth", () => {
    const es = EphemerisSeconds.fromDate(2019, 10, 9);

    const position = stateSolver.position(JplBodyId.Moon, JplBodyId.Earth, es, CorrectionType.NONE).coords;

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

  it("should correctly compute state for Moon wrt. Earth using WeGeocalc data", () => {
    const position: Vector3 = [317255.79483133, -220341.79779477, -119833.86746624];

    const rotationMatrix: Matrix3x3 = [
      [0.95774664, 0.28760734, -0.00183938],
      [-0.28760680, 0.95774841, 0.00055679],
      [0.00192180, -4.25031809E-06, 0.99999815]
    ];

    const bodyFixedPosition = RotationMatrix.multiplyVector(rotationMatrix, position);

    expect(bodyFixedPosition[0]).approximately(240699.17507517, 3e-3);
    expect(bodyFixedPosition[1]).approximately(-302343.65321879, 7e-3);
    expect(bodyFixedPosition[2]).approximately(-119223.00733439, 3e-4);
  });

});
