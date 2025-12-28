import { describe, it, expect } from "vitest";
import { EphemerisSeconds, JplBodyId } from "@jpl";
import { kernels } from "@jpl/data/kernels.testData";
import { CorrectionType } from "@jpl/state";
import { Frames } from "..";

// Test cases from: https://wgc.jpl.nasa.gov:8443/webgeocalc/#FrameTransformation
describe('TopocentricFrame', () => {

  const frames: Frames = kernels.frames();

  describe('transformVector3', () => {

    const stateSolver = kernels.stateSolver();

    it('should build transformation function for Earth', () => {
      const topocentricFrame = frames.topocentricFrame(JplBodyId.Earth, { latitude: 52, longitude: 17, altitude: 50 });

      const es = EphemerisSeconds.fromDate(2019, 10, 10);

      const position = stateSolver.position(JplBodyId.Venus, JplBodyId.Earth, es, CorrectionType.LIGHT_TIME_AND_STAR_ABBERATION).coords;
      const bodyFixedPositionVector = topocentricFrame.transformVector3(es)(position.toVector());

      expect(bodyFixedPositionVector[0]).approximately(57263972.35884452, 0);
      expect(bodyFixedPositionVector[1]).approximately(152501901.53510705, 0);
      expect(bodyFixedPositionVector[2]).approximately(-183234039.0792551, 0);
    });
  });

});
