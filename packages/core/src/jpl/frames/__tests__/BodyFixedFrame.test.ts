import { describe, it, expect } from "vitest";
import { EphemerisSeconds, JplBodyId, Matrix3x3, Vector3 } from "@jpl";
import { kernels } from "@jpl/data/kernels.testData";

function approximately(actual: Vector3, expected: Vector3, delta: number) {
  expect(actual[0]).approximately(expected[0], delta);
  expect(actual[1]).approximately(expected[1], delta);
  expect(actual[2]).approximately(expected[2], delta);
}

function approximately3x3(actual: Matrix3x3, expected: Matrix3x3, delta: number) {
  approximately(actual[0], expected[0], delta);
  approximately(actual[1], expected[1], delta);
  approximately(actual[2], expected[2], delta);
}

// Test cases from: https://wgc.jpl.nasa.gov:8443/webgeocalc/#FrameTransformation
describe('BodyFixed', () => {

  describe('getRotationAngles', () => {
    it('should return rotation angles for Earth', () => {
      const bodyFixedFrame = kernels.bodyFixedFrame();

      const es1 = EphemerisSeconds.fromDate(2019, 10, 10);
      const es2 = EphemerisSeconds.fromDate(2019, 10, 11);
      const es3 = EphemerisSeconds.fromDate(2019, 10, 12);

      approximately(bodyFixedFrame.getRotationAngles(JplBodyId.Earth, es1), [-72.17289475, 0.11012664, 89.87326539], 1e-8);
      approximately(bodyFixedFrame.getRotationAngles(JplBodyId.Earth, es2), [-71.18727125, 0.11014189, 89.87324784], 1e-8);
      approximately(bodyFixedFrame.getRotationAngles(JplBodyId.Earth, es3), [-70.20164775, 0.11015714, 89.87323029], 1e-8);
    });

    it('should return rotation angles for Moon', () => {
      const bodyFixedFrame = kernels.bodyFixedFrame();

      const es1 = EphemerisSeconds.fromDate(2019, 10, 10);
      const es2 = EphemerisSeconds.fromDate(2019, 10, 11);
      const es3 = EphemerisSeconds.fromDate(2019, 10, 12);

      approximately(bodyFixedFrame.getRotationAngles(JplBodyId.Moon, es1), [154.86483873, 23.80129410, -3.82071629], 1e-8);
      approximately(bodyFixedFrame.getRotationAngles(JplBodyId.Moon, es2), [168.04679783, 23.80801176, -3.82564601], 1e-8);
      approximately(bodyFixedFrame.getRotationAngles(JplBodyId.Moon, es3), [-178.77605679, 23.81506230, -3.82529824], 1e-8);
    });

    it('should return rotation angles for Mars', () => {
      const bodyFixedFrame = kernels.bodyFixedFrame();

      const es1 = EphemerisSeconds.fromDate(2019, 10, 10);
      const es2 = EphemerisSeconds.fromDate(2019, 10, 11);
      const es3 = EphemerisSeconds.fromDate(2019, 10, 12);

      approximately(bodyFixedFrame.getRotationAngles(JplBodyId.Mars, es1), [103.08290492, 37.12572022, 47.65950925], 1e-8);
      approximately(bodyFixedFrame.getRotationAngles(JplBodyId.Mars, es2), [93.97488994, 37.12572295, 47.65950463], 1e-8);
      approximately(bodyFixedFrame.getRotationAngles(JplBodyId.Mars, es3), [84.86687495, 37.12572570, 47.65950004], 1e-8);
    });
  });

  describe('getRotationMatrix', () => {
    it('should return rotation angles for Earth', () => {
      const bodyFixedFrame = kernels.bodyFixedFrame();

      const es1 = EphemerisSeconds.fromDate(2019, 10, 10);
      const es2 = EphemerisSeconds.fromDate(2019, 10, 11);
      const es3 = EphemerisSeconds.fromDate(2019, 10, 12);

      approximately3x3(bodyFixedFrame.getRotationMatrix(JplBodyId.Earth, es1), [
        [0.95265776, 0.30403923, -0.00182978],
        [-0.30403866, 0.95265951, 0.00058843],
        [0.00192207, -4.25149547E-06, 0.99999815]
      ], 1e-8);
      approximately3x3(bodyFixedFrame.getRotationMatrix(JplBodyId.Earth, es2), [
        [0.94728697, 0.32038115, -0.00181964],
        [-0.32038055, 0.94728872, 0.00061991],
        [0.00192233, -4.25267300E-06, 0.99999815]
      ], 1e-8);
      approximately3x3(bodyFixedFrame.getRotationMatrix(JplBodyId.Earth, es3), [
        [0.94163588, 0.33662827, -0.00180896],
        [-0.33662764, 0.94163762, 0.00065121],
        [0.00192260, -4.25385070E-06, 0.99999815]
      ], 1e-8);
    });

    it('should return rotation angles for Moon', () => {
      const bodyFixedFrame = kernels.bodyFixedFrame();

      const es1 = EphemerisSeconds.fromDate(2019, 10, 10);
      const es2 = EphemerisSeconds.fromDate(2019, 10, 11);
      const es3 = EphemerisSeconds.fromDate(2019, 10, 12);

      approximately3x3(bodyFixedFrame.getRotationMatrix(JplBodyId.Moon, es1), [
        [-0.87739998, 0.44809105, 0.17141669],
        [-0.47900535, -0.79816795, -0.36535162],
        [-0.02689148, -0.40266901, 0.91495055]
      ], 1e-8);
      approximately3x3(bodyFixedFrame.getRotationMatrix(JplBodyId.Moon, es2), [
        [-0.96349437, 0.25433966, 0.08360585],
        [-0.26637042, -0.87925233, -0.39492042],
        [-0.02693329, -0.40277373, 0.91490323]
      ], 1e-8);
      approximately3x3(bodyFixedFrame.getRotationMatrix(JplBodyId.Moon, es3), [
        [-0.99884816, 0.04720131, -0.00862495],
        [-0.03970741, -0.91403213, -0.40369369],
        [-0.02693835, -0.40288622, 0.91485355]
      ], 1e-8);
    });

    it('should return rotation angles for Mars', () => {
      const bodyFixedFrame = kernels.bodyFixedFrame();

      const es1 = EphemerisSeconds.fromDate(2019, 10, 10);
      const es2 = EphemerisSeconds.fromDate(2019, 10, 11);
      const es3 = EphemerisSeconds.fromDate(2019, 10, 12);

      approximately3x3(bodyFixedFrame.getRotationMatrix(JplBodyId.Mars, es1), [
        [-0.72650291, 0.35576349, 0.58789953],
        [-0.52264946, -0.84152928, -0.13662361],
        [0.44612898, -0.40652283, 0.79731307]
      ], 1e-8);
      approximately3x3(bodyFixedFrame.getRotationMatrix(JplBodyId.Mars, es2), [
        [-0.63460944, 0.48448882, 0.60211414],
        [-0.63106243, -0.77460294, -0.04183876],
        [0.44612897, -0.40652289, 0.79731304]
      ], 1e-8);
      approximately3x3(bodyFixedFrame.getRotationMatrix(JplBodyId.Mars, es3), [
        [-0.52671323, 0.60099695, 0.60114544],
        [-0.72356210, -0.68814370, 0.05400113],
        [0.44612897, -0.40652295, 0.79731301]
      ], 1e-8);
    });

  });
});
