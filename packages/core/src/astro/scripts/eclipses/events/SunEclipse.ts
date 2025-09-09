import { Radians } from "@astro/coords";
import { timeProperties } from "@astro/scripts/utils/time";
import { localMinimum } from "@astro/math/extremums/localMinimumUsingGoldenRatio";
import { JplBodyId } from "@jpl";
import { StateSolver, CorrectionType } from "@jpl/state";
import { EclipseType, SunEclipse } from "..";
import { Ephemerides } from "@astro/scripts";

function buildAngleCalculatorBetweenSunAndMoon(stateSolver: StateSolver) {
  return (es: number) => {
    const sunPosition = stateSolver.position(JplBodyId.Sun, JplBodyId.Earth, es, CorrectionType.LIGHT_TIME_AND_STAR_ABBERATION).coords;
    const moonPosition = stateSolver.position(JplBodyId.Moon, JplBodyId.Earth, es, CorrectionType.LIGHT_TIME_AND_STAR_ABBERATION).coords;


    // const moonWrtEarthCorrectedPosition = stateSolver.position(JplBodyId.Moon, JplBodyId.Earth, es, CorrectionType.LIGHT_TIME);
    // const esAtMoon = es - moonWrtEarthCorrectedPosition.lightTime;

    // const sunFromMoonPosition2 = stateSolver.position(JplBodyId.Sun, JplBodyId.Moon, esAtMoon, CorrectionType.LIGHT_TIME);
    // const sunWrtSSBPosition2 = sunFromMoonPosition2.targetPositionWrtSSB;

    // if (sunWrtSSBPosition2 === undefined) {
    //   throw new Error(`Cannot calculate position for bodyId='${JplBodyId.Sun}'`);
    // }

    // const earthPosition = stateSolver.position(JplBodyId.Earth, JplBodyId.SolarSystemBarycenter, es, CorrectionType.NONE).coords;
    // const sunWrtEarthCorrectedPosition = sunWrtSSBPosition2.subtract(earthPosition);

    return Radians.between(sunPosition, moonPosition);
  };
}

export function findSunEclipses(stateSolver: StateSolver, ephemerides: Ephemerides, fromEs: number, toEs: number): SunEclipse {
  const sunAndMoonAngle = buildAngleCalculatorBetweenSunAndMoon(stateSolver);

  const midPointEs = fromEs + (toEs - fromEs) / 2;
  const [eventEs, minSeparation, minSeparationEs, iterations] = localMinimum(sunAndMoonAngle, fromEs, midPointEs, toEs, { maxResultRangeWidth: 1, maxIterations: 40 });

  console.log(`SunEclipse: es= ${eventEs}, angle=${minSeparation}, minSeparationEs=${minSeparationEs}, iterations=${iterations}`);

  return {
    type: EclipseType.SunEclipse,
    ...timeProperties(eventEs),
    sunEphemeris: ephemerides.detailedCoordinatesForBody(JplBodyId.Sun, eventEs),
    moonEphemeris: ephemerides.detailedCoordinatesForBody(JplBodyId.Moon, eventEs),
    separation: minSeparation,
  }
}
