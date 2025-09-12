import { ObserverLocation, Radians } from "@astro/coords";
import { timeProperties } from "@astro/scripts/utils/time";
import { localMinimum } from "@astro/math/extremums/localMinimumUsingGoldenRatio";
import { JplBodyId } from "@jpl";
import { StateSolver, CorrectionType } from "@jpl/state";
import { EclipseType, SunEclipse } from "..";
import { Ephemerides } from "@astro/scripts";
import { ParalaxCorrection } from "@astro/scripts/paralaxCorrection/ParalaxCorrection";

function buildAngleCalculatorBetweenSunAndMoon(stateSolver: StateSolver) {
  return (es: number) => {
    const sunPosition = stateSolver.position(JplBodyId.Sun, JplBodyId.Earth, es, CorrectionType.LIGHT_TIME_AND_STAR_ABBERATION).coords;
    const moonPosition = stateSolver.position(JplBodyId.Moon, JplBodyId.Earth, es, CorrectionType.LIGHT_TIME_AND_STAR_ABBERATION).coords;
    return Radians.between(sunPosition, moonPosition);
  };
}

function buildAngleCalculatorBetweenSunAndMoonWithParalaxCorrection(stateSolver: StateSolver, paralaxCorrection: ParalaxCorrection, observerLocation: ObserverLocation) {
  return (es: number) => {
    const sunPosition = stateSolver.position(JplBodyId.Sun, JplBodyId.Earth, es, CorrectionType.LIGHT_TIME_AND_STAR_ABBERATION).coords;
    const moonPosition = stateSolver.position(JplBodyId.Moon, JplBodyId.Earth, es, CorrectionType.LIGHT_TIME_AND_STAR_ABBERATION).coords;

    const observerCoordinates = paralaxCorrection.observerPosition(observerLocation, es);
    const sunObserverPosition = sunPosition.subtract(observerCoordinates);
    const moonObserverPosition = moonPosition.subtract(observerCoordinates);

    return Radians.between(sunObserverPosition, moonObserverPosition);
  };
}

function buildSunEclipseFinder(ephemerides: Ephemerides, angleCalculator: (es: number) => number) {
  return (fromEs: number, toEs: number): SunEclipse => {
    const midPointEs = fromEs + (toEs - fromEs) / 2;
    const [eventEs, minSeparation, minSeparationEs, iterations] = localMinimum(angleCalculator, fromEs, midPointEs, toEs, { maxResultRangeWidth: 1, maxIterations: 40 });

    console.log(`SunEclipse: es= ${eventEs}, angle=${minSeparation}, minSeparationEs=${minSeparationEs}, iterations=${iterations}`);

    return {
      type: EclipseType.SunEclipse,
      ...timeProperties(eventEs),
      sunEphemeris: ephemerides.detailedCoordinatesForBody(JplBodyId.Sun, eventEs),
      moonEphemeris: ephemerides.detailedCoordinatesForBody(JplBodyId.Moon, eventEs),
      separation: minSeparation,
    }
  };
}

export function getSunEclipseFinder(stateSolver: StateSolver, ephemerides: Ephemerides) {
  const sunAndMoonAngle = buildAngleCalculatorBetweenSunAndMoon(stateSolver);
  return buildSunEclipseFinder(ephemerides, sunAndMoonAngle);
}

export function getSunEclipseFinderWithParalaxCorrection(stateSolver: StateSolver, ephemerides: Ephemerides, paralaxCorrection: ParalaxCorrection, observerLocation: ObserverLocation) {
  const sunAndMoonAngle = buildAngleCalculatorBetweenSunAndMoonWithParalaxCorrection(stateSolver, paralaxCorrection, observerLocation);
  return buildSunEclipseFinder(ephemerides, sunAndMoonAngle);
}
