import { ObserverLocation, Radians } from "@astro/coords";
import { findSampledLocalExtremums } from "@astro/math";
import { EphemerisSeconds, JplBodyId } from "@jpl";
import { StateSolver, CorrectionType } from '@jpl/state';
import { KernelsRepository } from "@jpl/kernels";
import { Eclipse, MoonEclipse, SunEclipse } from ".";
import { Ephemerides } from "../ephemeris";
import { getSunEclipseFinder } from "./events/SunEclipse";
import { findMoonEclipses } from "./events/MoonEclipse";
import { ParalaxCorrection } from "../paralaxCorrection/ParalaxCorrection";

const PRELIMINARY_INTERVAL = EphemerisSeconds.fromDays(1);

const PRELIMINARY_ANGLE_RANGE = Radians.fromDegrees(16);

const DETAILED_ANGLE_RANGE = Radians.fromDegrees(1.5);

type Separation = {
  es: number;
  separation: number;
}

function buildRoughAngleBetweenSunAndMoon(stateSolver: StateSolver) {
  return (es: number) => {
    const sunPosition = stateSolver.position(JplBodyId.Sun, JplBodyId.Earth, es, CorrectionType.NONE).coords;
    const moonPosition = stateSolver.position(JplBodyId.Moon, JplBodyId.Earth, es, CorrectionType.NONE).coords;
    return Radians.between(sunPosition, moonPosition);
  };
}

export class Eclipses {

  readonly stateSolver: StateSolver;

  readonly ephemerides: Ephemerides;

  readonly paralaxCorrection: ParalaxCorrection;

  constructor(kernels: KernelsRepository) {
    this.stateSolver = kernels.stateSolver();
    this.ephemerides = new Ephemerides(kernels);
    this.paralaxCorrection = new ParalaxCorrection(kernels);
  }

  forSunAndMoon(fromJde: number, toJde: number, observerLocation: ObserverLocation): Eclipse[] {
    const sunAndMoonAngle = buildRoughAngleBetweenSunAndMoon(this.stateSolver);

    const correctedFromEs = EphemerisSeconds.fromJde(fromJde) - PRELIMINARY_INTERVAL;
    const correctedToEs = EphemerisSeconds.fromJde(toJde) + PRELIMINARY_INTERVAL;
    const sunMoonSeparations = EphemerisSeconds.forRange(correctedFromEs, correctedToEs, PRELIMINARY_INTERVAL)
      .map<Separation>(es => ({
        es,
        separation: sunAndMoonAngle(es)
      }));

    const { minimums, maximums } = findSampledLocalExtremums(sunMoonSeparations, minSepration => minSepration.separation);

    const findSunEclipse = getSunEclipseFinder(this.stateSolver, this.ephemerides, this.paralaxCorrection, observerLocation);

    const sunEclipses = minimums
      .filter(minSeparation => minSeparation.separation < PRELIMINARY_ANGLE_RANGE)
      .map<SunEclipse>(separation => {
        try {
          return findSunEclipse(separation.es - PRELIMINARY_INTERVAL, separation.es + PRELIMINARY_INTERVAL);
        } catch (error) {
          const fromTde = EphemerisSeconds.toDateObject(separation.es - PRELIMINARY_INTERVAL);
          const toTde = EphemerisSeconds.toDateObject(separation.es + PRELIMINARY_INTERVAL);
          console.error(`Error finding sun eclipse between ${fromTde.toISOString()}(${separation.es - PRELIMINARY_INTERVAL}) and ${toTde.toISOString()}(${separation.es + PRELIMINARY_INTERVAL})`, error);
          throw error;
        }
      });

    const moonEclipses = maximums
      .filter(separation => separation.separation > Math.PI - PRELIMINARY_ANGLE_RANGE)
      .map<MoonEclipse>(separation =>
        findMoonEclipses(this.stateSolver, separation.es - PRELIMINARY_INTERVAL, separation.es + PRELIMINARY_INTERVAL));

    const allEclipses = [...sunEclipses, ...moonEclipses]
      .filter(eclipse => eclipse.separation < DETAILED_ANGLE_RANGE)
      .sort((a, b) => a.es - b.es);

    allEclipses.forEach(eclipse => {
      console.log(`${eclipse.type}: jde= ${eclipse.jde}, date=${eclipse.tde.toISOString()}, angle=${Radians.toDegrees(eclipse.separation)}°`);
    });

    return allEclipses;
  }

};
