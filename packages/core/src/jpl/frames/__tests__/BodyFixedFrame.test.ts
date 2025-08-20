import { describe, it, expect } from "vitest";
import { EphemerisSeconds, JplBodyId, Vector3 } from "@jpl";
import { kernels } from "@jpl/data/kernels.testData";

function approximately(expected: Vector3, actual: Vector3, delta: number) {
  expect(expected[0]).approximately(actual[0], delta);
  expect(expected[1]).approximately(actual[1], delta);
  expect(expected[2]).approximately(actual[2], delta);
}

describe('BodyFixed', () => {

  describe('getRotation', () => {
    it('should return rotation for Earth', () => {
      const bodyFixedFrame = kernels.bodyFixedFrame();

      const es1 = EphemerisSeconds.fromDate(2019, 10, 10);
      const es2 = EphemerisSeconds.fromDate(2019, 10, 11);
      const es3 = EphemerisSeconds.fromDate(2019, 10, 12);

      approximately(bodyFixedFrame.getRotation(JplBodyId.Earth, es1), [-72.17289475, 0.11012664, 89.87326539], 1e-8);
      approximately(bodyFixedFrame.getRotation(JplBodyId.Earth, es2), [-71.18727125, 0.11014189, 89.87324784], 1e-8);
      approximately(bodyFixedFrame.getRotation(JplBodyId.Earth, es3), [-70.20164775, 0.11015714, 89.87323029], 1e-8);
    });
  });

  describe('getRotation', () => {
    it.skip('should return rotation for Moon', () => {
      const bodyFixedFrame = kernels.bodyFixedFrame();

      const es1 = EphemerisSeconds.fromDate(2019, 10, 10);
      const es2 = EphemerisSeconds.fromDate(2019, 10, 11);
      const es3 = EphemerisSeconds.fromDate(2019, 10, 12);

      approximately(bodyFixedFrame.getRotation(JplBodyId.Moon, es1), [154.86483873, 23.80129410, -3.82071629], 1e-8);
      approximately(bodyFixedFrame.getRotation(JplBodyId.Moon, es2), [168.04679783, 23.80801176, -3.82564601], 1e-8);
      approximately(bodyFixedFrame.getRotation(JplBodyId.Moon, es3), [178.77605679, 23.81506230, -3.82529824], 1e-8);
    });
  });
});
