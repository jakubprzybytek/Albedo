import { AstronomicalCoordinates, Radians } from "@astro/coords";
import { localExtremums } from "@astro/math";
import { localMinimum } from "@astro/math/extremums/localMinimumUsingGoldenRatio";
import { EphemerisSeconds, JplBodyId } from "@jpl";
import { StateSolver, CorrectionType } from '@jpl/state';
import { timeProperties } from '@astro/scripts/utils/time';
import { Eclipse, EclipseType, MoonEclipse, SunEclipse } from ".";
import { Ephemerides } from "../ephemeris";
import { Bodies } from "src/catalogues/Bodies";

const PRELIMINARY_INTERVAL = EphemerisSeconds.fromDays(1);

const PRELIMINARY_ANGLE_RANGE = Radians.fromDegrees(16);

const DETAILED_ANGLE_RANGE = Radians.fromDegrees(1.5);

type Separation = {
  es: number;
  separation: number;
}

function simpleSunMoonFunctions(stateSolver: StateSolver) {

  function sunAndMoonAngle(es: number) {
    const sunPosition = stateSolver.positionFor(JplBodyId.Sun, JplBodyId.Earth, es, CorrectionType.NONE);
    const moonPosition = stateSolver.positionFor(JplBodyId.Moon, JplBodyId.Earth, es, CorrectionType.NONE);

    return Radians.between(sunPosition, moonPosition);
  }

  function earthsShadowAndMoonAngle(es: number) {
    const sunPosition = stateSolver.positionFor(JplBodyId.Sun, JplBodyId.Earth, es, CorrectionType.NONE);
    const earthsShadowPosition = sunPosition.negate();

    const moonPosition = stateSolver.positionFor(JplBodyId.Moon, JplBodyId.Earth, es, CorrectionType.NONE);

    return Radians.between(moonPosition, earthsShadowPosition);
  }

  return {
    sunAndMoonAngle,
    earthsShadowAndMoonAngle
  }
}

function computeMoonAndEarthShadowEphemeris(stateSolver: StateSolver, es: number): Pick<MoonEclipse, 'moonEphemeris' | 'earthShadowEphemeris'> {
  const sunPosition = stateSolver.positionFor(JplBodyId.Sun, JplBodyId.Earth, es, CorrectionType.LIGHT_TIME_AND_STAR_ABBERATION);
  const earthsShadowPosition = sunPosition.negate();

  const moonPosition = stateSolver.positionFor(JplBodyId.Moon, JplBodyId.Earth, es, CorrectionType.LIGHT_TIME_AND_STAR_ABBERATION);

  const sunRadius = Bodies[JplBodyId.Sun].equatorialRadiusKm;
  const sunDiameter = sunRadius * 2;
  const distanceToSun = sunPosition.length();

  const earthRadius = Bodies[JplBodyId.Earth].equatorialRadiusKm;
  const earthDiameter = earthRadius * 2;

  const distanceToMoon = moonPosition.length();

  const umbraAngularSizeKm = earthRadius - (distanceToMoon / distanceToSun) * (sunRadius - earthRadius);
  const penumbraAngularSizeKm = distanceToMoon * (sunDiameter + earthDiameter) / distanceToSun + earthDiameter;

  return {
    moonEphemeris: {
      coords: AstronomicalCoordinates.fromRectangular(moonPosition),
      angularSizeDeg: Radians.toDegrees(Radians.angularSize(Bodies[JplBodyId.Moon].equatorialRadiusKm * 2, distanceToMoon))
    },
    earthShadowEphemeris: {
      coords: AstronomicalCoordinates.fromRectangular(earthsShadowPosition),
      umbraAngularSizeDeg: Radians.toDegrees(Radians.angularSize(umbraAngularSizeKm, distanceToMoon)),
      penumbraAngularSizeDeg: Radians.toDegrees(Radians.angularSize(penumbraAngularSizeKm, distanceToMoon))
    }
  };
}

export class Eclipses {

  readonly stateSolver: StateSolver;

  readonly ephemerides: Ephemerides;

  constructor(stateSolver: StateSolver) {
    this.stateSolver = stateSolver;
    this.ephemerides = new Ephemerides(stateSolver);
  }

  forSunAndMoon(fromJde: number, toJde: number): Eclipse[] {
    const { sunAndMoonAngle, earthsShadowAndMoonAngle } = simpleSunMoonFunctions(this.stateSolver);

    const correctedFromEs = EphemerisSeconds.fromJde(fromJde) - PRELIMINARY_INTERVAL;
    const correctedToEs = EphemerisSeconds.fromJde(toJde) + PRELIMINARY_INTERVAL;
    const sunMoonSeparations = EphemerisSeconds.forRange(correctedFromEs, correctedToEs, PRELIMINARY_INTERVAL)
      .map<Separation>(es => ({
        es,
        separation: sunAndMoonAngle(es)
      }));

    const { minimums, maximums } = localExtremums(sunMoonSeparations, minSepration => minSepration.separation);
    // console.log('Minimums', minimums);
    // console.log('Maximums', maximums);

    const sunEclipses = minimums
      .filter(minSeparation => minSeparation.separation < PRELIMINARY_ANGLE_RANGE)
      .map<SunEclipse>(separation => {
        const a = separation.es - PRELIMINARY_INTERVAL;
        const b = separation.es;
        const c = separation.es + PRELIMINARY_INTERVAL;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const [eventEs, minSeparation, resultRangeWidth, iterations] = localMinimum(sunAndMoonAngle, a, b, c, { maxResultRangeWidth: 10, maxIterations: 30 });
        // console.log(`jde: ${EphemerisSeconds.toJde(eventEs)}, date=${JulianDay.toDateTime(EphemerisSeconds.toJde(eventEs)).toISOString()}, angle=${Radians.toDegrees(minSeparation)}°, result range width=${resultRangeWidth}, iterations=${iterations}`);
        return {
          type: EclipseType.SunEclipse,
          ...timeProperties(eventEs),
          sunEphemeris: this.ephemerides.detailedCoordinatesForBody(JplBodyId.Sun, eventEs),
          moonEphemeris: this.ephemerides.detailedCoordinatesForBody(JplBodyId.Moon, eventEs),
          separation: minSeparation,
        }
      });

    const moonEclipses = maximums
      .filter(separation => separation.separation > Math.PI - PRELIMINARY_ANGLE_RANGE)
      .map<MoonEclipse>(separation => {
        // console.log(`jde: ${separation.jde}, date=${JulianDay.toDateTime(separation.jde).toISOString()}, angle=${Radians.toDegrees(separation.separation)}°`);
        const a = separation.es - PRELIMINARY_INTERVAL;
        const b = separation.es;
        const c = separation.es + PRELIMINARY_INTERVAL;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const [eventEs, minSeparation, _resultRangeWidth, _iterations] = localMinimum(earthsShadowAndMoonAngle, a, b, c, { maxResultRangeWidth: 10, maxIterations: 30 });
        // console.log(`jde: ${EphemerisSeconds.toJde(eventEs)}, date=${JulianDay.toDateTime(EphemerisSeconds.toJde(eventEs)).toISOString()}, angle=${Radians.toDegrees(minSeparation)}°, result range width=${resultRangeWidth}, iterations=${iterations}`);
        return {
          type: EclipseType.MoonEclipse,
          ...timeProperties(eventEs),
          ...computeMoonAndEarthShadowEphemeris(this.stateSolver, eventEs),
          separation: minSeparation,
        }
      });

    const eclipses = [...sunEclipses, ...moonEclipses]
      .filter(eclipse => eclipse.separation < DETAILED_ANGLE_RANGE)
      .sort((a, b) => a.es - b.es);

    eclipses.forEach(eclipse => {
      console.log(`${eclipse.type}: jde= ${eclipse.jde}, date=${eclipse.tde.toISOString()}, angle=${Radians.toDegrees(eclipse.separation)}°`);
    });

    return eclipses;
  }

};
