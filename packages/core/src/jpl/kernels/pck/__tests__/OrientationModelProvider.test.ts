import { describe, it, expect } from "vitest";
import { EphemerisSeconds, JplBodyId } from "@jpl";
import { kernels } from "@jpl/data/kernels.testData";

describe('OrientationModelProvider', () => {

  describe('getOrientationModel', () => {
    it('should return orientation model for a body with valid orientation and barycenter models', () => {
      const orientationModelProvider = kernels.orientationModelProvider();

      // Test
      const es = EphemerisSeconds.fromDate(2019, 10, 10);
      const result = orientationModelProvider.getOrientationModel(JplBodyId.Earth, es);

      const W = result.W % 360;

      const rotation = [
        W > 180 ? W - 360 : W,
        90 - result.Dec,
        90 + result.RA
      ]

      // Verify
      expect(rotation[0]).approximately(-72.17289475, 1e-8);
      expect(rotation[1]).approximately(0.11012664, 1e-8);
      expect(rotation[2]).approximately(89.87326539, 1e-8);
    });
  });
});
