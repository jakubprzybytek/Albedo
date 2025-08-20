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

      const rotation = [
        result.W % 360,
        90 - result.Dec,
        90 + result.RA
      ]

      // Verify
      expect(rotation).toEqual([
        -72.17289475,
        0.11012664,
        89.87326539
      ]);
    });
  });
});
