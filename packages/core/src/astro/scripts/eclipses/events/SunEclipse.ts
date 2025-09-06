import { Radians } from "@astro/coords";
import { timeProperties } from "@astro/scripts/utils/time";
import { localMinimum } from "@astro/math/extremums/localMinimumUsingGoldenRatio";
import { JplBodyId } from "@jpl";
import { StateSolver, CorrectionType } from "@jpl/state";
import { EclipseType, SunEclipse } from "..";
import { Ephemerides } from "@astro/scripts";

function buildRoughAngleBetweenSunAndMoon(stateSolver: StateSolver) {
  return (es: number) => {
    const sunPosition = stateSolver.position(JplBodyId.Sun, JplBodyId.Earth, es, CorrectionType.NONE).coords;
    const moonPosition = stateSolver.position(JplBodyId.Moon, JplBodyId.Earth, es, CorrectionType.NONE).coords;
    
    const moonPosition2 = stateSolver.position(JplBodyId.Moon, JplBodyId.Earth, es, CorrectionType.LIGHT_TIME_AND_STAR_ABBERATION);
    const esAtMoon = es - moonPosition2.lightTime;

    const sunFromMoonPosition2 = stateSolver.position(JplBodyId.Sun, JplBodyId.Moon, esAtMoon, CorrectionType.LIGHT_TIME_AND_STAR_ABBERATION);

    
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
