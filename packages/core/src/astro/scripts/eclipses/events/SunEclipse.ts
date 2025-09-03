import { Radians } from "@astro/coords";
import { timeProperties } from "@astro/scripts/utils/time";
import { localMinimum } from "@astro/math/extremums/localMinimumUsingGoldenRatio";
import { JplBodyId } from "@jpl";
import { StateSolver, CorrectionType } from "@jpl/state";
import { EclipseType, SunEclipse } from "..";
import { Ephemerides } from "@astro/scripts";

function buildRoughAngleBetweenSunAndMoon(stateSolver: StateSolver) {
  return (es: number) => {
    const sunPosition = stateSolver.positionFor(JplBodyId.Sun, JplBodyId.Earth, es, CorrectionType.NONE);
    const moonPosition = stateSolver.positionFor(JplBodyId.Moon, JplBodyId.Earth, es, CorrectionType.NONE);
    return Radians.between(sunPosition, moonPosition);
  };
}

export function findSunEclipses(stateSolver: StateSolver, ephemerides: Ephemerides, fromEs: number, toEs: number): SunEclipse {
  const sunAndMoonAngle = buildRoughAngleBetweenSunAndMoon(stateSolver);

  const midPointEs = fromEs + (toEs - fromEs) / 2;
  const [eventEs, minSeparation] = localMinimum(sunAndMoonAngle, fromEs, midPointEs, toEs, { maxResultRangeWidth: 10, maxIterations: 30 });

  return {
    type: EclipseType.SunEclipse,
    ...timeProperties(eventEs),
    sunEphemeris: ephemerides.detailedCoordinatesForBody(JplBodyId.Sun, eventEs),
    moonEphemeris: ephemerides.detailedCoordinatesForBody(JplBodyId.Moon, eventEs),
    separation: minSeparation,
  }
}
