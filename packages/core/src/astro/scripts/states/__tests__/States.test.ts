import { describe, it, expect } from "vitest";
import { EphemerisSeconds, JplBodyId } from "@jpl";
import { CorrectionType } from "@jpl/state";
import { kernels } from "@jpl/data/kernels.testData";
import { States } from "../States";
import { Radians, RectangularCoordinates } from "@astro/coords";

describe("States", () => {
  const states = new States(kernels);

  describe("should build state funtion", () => {
    it("for moon w.r.t. Earth with paralax correction", () => {
      const observerLocation = { latitude: 52, longitude: 17, altitude: 50 };
      const positionFunction = states.buildParalaxCorrectedPositionFunction(
        JplBodyId.Moon,
        JplBodyId.Earth,
        observerLocation,
        CorrectionType.LIGHT_TIME_AND_STAR_ABBERATION
      );

      expect(positionFunction(EphemerisSeconds.fromDate(2019, 10, 9)))
        .toStrictEqual(new RectangularCoordinates(313997.7900225476, -222544.67021001116, -124840.4076791938));
    });

    it("correct paralax", () => {
      const es = EphemerisSeconds.fromDate(2019, 10, 9);
      const observerLocation = { latitude: 52, longitude: 17, altitude: 50 };
      const paralaxCorrectedPosition = states.buildParalaxCorrectedPositionFunction(
        JplBodyId.Moon,
        JplBodyId.Earth,
        observerLocation,
        CorrectionType.LIGHT_TIME_AND_STAR_ABBERATION
      )(es);
      const position = states.buildPositionFunction(
        JplBodyId.Moon,
        JplBodyId.Earth,
        CorrectionType.LIGHT_TIME_AND_STAR_ABBERATION)(es);

      const paralaxCorrectionAngle = Radians.between(paralaxCorrectedPosition, position);

      const maximumParalaxCorrectionAngle = Math.atan(6378 / position.length());
      expect(paralaxCorrectionAngle).lessThan(maximumParalaxCorrectionAngle);
    });
  });

  it("should compute position for Moon w.r.t. Earth", () => {
    const position = states.computePosition(JplBodyId.Moon, JplBodyId.Earth, EphemerisSeconds.fromDateTime(2019, 10, 9, 1, 0, 0), CorrectionType.NONE);

    expect(position.x).approximately(319443.56365777, 1e-5);
    expect(position.y).approximately(-217760.06303164, 1e-5);
    expect(position.z).approximately(-118976.64927161, 4e-6);
  });

  it("should compute positions for Moon w.r.t. Earth", () => {
    const fromEs = EphemerisSeconds.fromDateTime(2019, 10, 9, 1, 0, 0);
    const toEs = EphemerisSeconds.fromDateTime(2019, 10, 9, 1, 0, 0);

    const [position] = states.computePositions(JplBodyId.Moon, JplBodyId.Earth, fromEs, toEs, 1, CorrectionType.NONE);

    expect(position.es).equals(fromEs);
    expect(position.coords.x).approximately(319443.56365777, 1e-5);
    expect(position.coords.y).approximately(-217760.06303164, 1e-5);
    expect(position.coords.z).approximately(-118976.64927161, 4e-6);
  });

  it("should compute state for Moon w.r.t. Earth", () => {
    const fromEs = EphemerisSeconds.fromDateTime(2019, 10, 9, 1, 0, 0);
    const toEs = EphemerisSeconds.fromDateTime(2019, 10, 9, 1, 0, 0);

    const [state] = states.computeStates(JplBodyId.Moon, JplBodyId.Earth, fromEs, toEs, 1, CorrectionType.NONE);

    expect(state.es).equals(fromEs);
    expect(state.position.x).approximately(319443.56365777, 1e-5);
    expect(state.position.y).approximately(-217760.06303164, 1e-5);
    expect(state.position.z).approximately(-118976.64927161, 4e-6);
  });
});
