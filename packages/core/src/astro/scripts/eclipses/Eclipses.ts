import { Radians } from "@astro/coords";
import { localExtremums } from "@astro/math";
import { localMinimum } from "@astro/math/extremums/localMinimumUsingGoldenRatio";
import { EphemerisSeconds, JplBodyId } from "@jpl";
import { StateSolver2, CorrectionType2 } from '@jpl/state';
import { kernelRepository } from '@jpl/data/de440.full';
import { timeProperties } from '@astro/scripts/utils/time';
import { Eclipse, EclipseType } from ".";

const PRELIMINARY_INTERVAL = EphemerisSeconds.fromDays(1);

const PRELIMINARY_ANGLE_RANGE = Radians.fromDegrees(16);

const DETAILED_ANGLE_RANGE = Radians.fromDegrees(1.5);

type Separation = {
  es: number;
  separation: number;
}

function simpleSunMoonFunctions() {
  const stateSolver = kernelRepository.stateSolver2();

  function sunAndMoonAngle(es: number) {
    const sunPosition = stateSolver.positionFor(JplBodyId.Sun, JplBodyId.Earth, es, CorrectionType2.NONE);
    const moonPosition = stateSolver.positionFor(JplBodyId.Moon, JplBodyId.Earth, es, CorrectionType2.NONE);

    return Radians.between(sunPosition, moonPosition);
  }

  function earthsShadowAndMoonAngle(es: number) {
    const sunPosition = stateSolver.positionFor(JplBodyId.Sun, JplBodyId.Earth, es, CorrectionType2.NONE);
    const earthsShadowPosition = sunPosition.negate();

    const moonPosition = stateSolver.positionFor(JplBodyId.Moon, JplBodyId.Earth, es, CorrectionType2.NONE);

    return Radians.between(moonPosition, earthsShadowPosition);
  }

  return {
    sunAndMoonAngle,
    earthsShadowAndMoonAngle
  }
}

export class Eclipses {

  readonly stateSolver: StateSolver2;

  constructor(stateSolver: StateSolver2) {
    this.stateSolver = stateSolver;
  }

  forSunAndMoon(fromJde: number, toJde: number): Eclipse[] {
    const { sunAndMoonAngle, earthsShadowAndMoonAngle } = simpleSunMoonFunctions();

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
      .map<Eclipse>(separation => {
        const a = separation.es - PRELIMINARY_INTERVAL;
        const b = separation.es;
        const c = separation.es + PRELIMINARY_INTERVAL;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const [eventEs, minSeparation, resultRangeWidth, iterations] = localMinimum(sunAndMoonAngle, a, b, c, { maxResultRangeWidth: 10, maxIterations: 30 });
        // console.log(`jde: ${EphemerisSeconds.toJde(eventEs)}, date=${JulianDay.toDateTime(EphemerisSeconds.toJde(eventEs)).toISOString()}, angle=${Radians.toDegrees(minSeparation)}°, result range width=${resultRangeWidth}, iterations=${iterations}`);
        return {
          type: EclipseType.SunEclipse,
          ...timeProperties(eventEs),
          separation: minSeparation,
          positionAngle: NaN
        }
      });

    const moonEclipses = maximums
      .filter(separation => separation.separation > Math.PI - PRELIMINARY_ANGLE_RANGE)
      .map<Eclipse>(separation => {
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
          separation: minSeparation,
          positionAngle: NaN
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
