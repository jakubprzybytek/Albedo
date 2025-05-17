import { Eclipse, EclipseType } from ".";
import { EphemerisSeconds, JplBodyId } from "@jpl";
import { kernelRepository } from '@jpl/data/de440.full';
import { States } from "@jpl/state";
import { JulianDay } from "@astro";
import { Radians } from "@astro/coords";
import { localExtremums } from "@astro/math";
import { localMinimum } from "@astro/math/extremums/localMinimumUsingGoldenRatio";
import { Separations } from "../separations";

const COARSE_PRELIMINARY_INTERVAL = 1;

const PRELIMINARY_ANGLE_RANGE = Radians.fromDegrees(16);
const DETAILED_ANGLE_RANGE = Radians.fromDegrees(1.5);

function simpleSunMoonFunctions() {
  const sunStateSolver = kernelRepository.stateSolverBuilder()
    .forTarget(JplBodyId.Sun)
    .forObserver(JplBodyId.Earth)
    .build();

  const moonStateSolver = kernelRepository.stateSolverBuilder()
    .forTarget(JplBodyId.Moon)
    .forObserver(JplBodyId.Earth)
    .build();

  function sunAndMoonAngle(es: number) {
    const sunPosition = sunStateSolver.positionFor(es);
    const moonPosition = moonStateSolver.positionFor(es);

    return Radians.between(sunPosition, moonPosition);
  }

  function earthsShadowAndMoonAngle(es: number) {
    const sunPosition = sunStateSolver.positionFor(es);
    const earthsShadowPosition = sunPosition.negate();

    const moonPosition = moonStateSolver.positionFor(es);

    return Radians.between(moonPosition, earthsShadowPosition);
  }

  return {
    sunAndMoonAngle,
    earthsShadowAndMoonAngle
  }
}

export class Eclipses {
  static forSunAndMoon(fromJde: number, toJde: number): Eclipse[] {
    const correctedFromJde = fromJde - COARSE_PRELIMINARY_INTERVAL;
    const correctedToJde = toJde + COARSE_PRELIMINARY_INTERVAL;

    const sunPositions = States.position(JplBodyId.Sun, JplBodyId.Earth, correctedFromJde, correctedToJde, COARSE_PRELIMINARY_INTERVAL);
    const moonPositions = States.position(JplBodyId.Moon, JplBodyId.Earth, correctedFromJde, correctedToJde, COARSE_PRELIMINARY_INTERVAL);

    const sunMoonSeparations = Separations.fromPositions(sunPositions, moonPositions);
    const { minimums, maximums } = localExtremums(sunMoonSeparations, separation => separation.separation);
    // console.log(sunMoonSeparations);
    // console.log('Minimums', minimums);
    // console.log('Maximums', maximums);

    const { sunAndMoonAngle, earthsShadowAndMoonAngle } = simpleSunMoonFunctions();

    const sunEclipses = minimums
      .filter(separation => separation.separation < PRELIMINARY_ANGLE_RANGE)
      .map<Eclipse>(separation => {
        const a = EphemerisSeconds.fromJde(separation.jde - COARSE_PRELIMINARY_INTERVAL);
        const b = EphemerisSeconds.fromJde(separation.jde);
        const c = EphemerisSeconds.fromJde(separation.jde + COARSE_PRELIMINARY_INTERVAL);
        const [eventEs, minSeparation, resultRangeWidth, iterations] = localMinimum(sunAndMoonAngle, a, b, c, { maxResultRangeWidth: 10, maxIterations: 30 });
        // console.log(`jde: ${EphemerisSeconds.toJde(eventEs)}, date=${JulianDay.toDateTime(EphemerisSeconds.toJde(eventEs)).toISOString()}, angle=${Radians.toDegrees(minSeparation)}°, result range width=${resultRangeWidth}, iterations=${iterations}`);
        return {
          type: EclipseType.SunEclipse,
          jde: EphemerisSeconds.toJde(eventEs),
          eventTimeRangeWidthSeconds: resultRangeWidth,
          tde: JulianDay.toDateTime(EphemerisSeconds.toJde(eventEs)),
          separation: minSeparation,
          positionAngle: NaN
        }
      });

    const moonEclipses = maximums
      .filter(separation => separation.separation > Math.PI - PRELIMINARY_ANGLE_RANGE)
      .map<Eclipse>(separation => {
        // console.log(`jde: ${separation.jde}, date=${JulianDay.toDateTime(separation.jde).toISOString()}, angle=${Radians.toDegrees(separation.separation)}°`);
        const a = EphemerisSeconds.fromJde(separation.jde - COARSE_PRELIMINARY_INTERVAL);
        const b = EphemerisSeconds.fromJde(separation.jde);
        const c = EphemerisSeconds.fromJde(separation.jde + COARSE_PRELIMINARY_INTERVAL);
        const [eventEs, minSeparation, resultRangeWidth, iterations] = localMinimum(earthsShadowAndMoonAngle, a, b, c, { maxResultRangeWidth: 10, maxIterations: 30 });
        // console.log(`jde: ${EphemerisSeconds.toJde(eventEs)}, date=${JulianDay.toDateTime(EphemerisSeconds.toJde(eventEs)).toISOString()}, angle=${Radians.toDegrees(minSeparation)}°, result range width=${resultRangeWidth}, iterations=${iterations}`);
        return {
          type: EclipseType.MoonEclipse,
          jde: EphemerisSeconds.toJde(eventEs),
          eventTimeRangeWidthSeconds: resultRangeWidth,
          tde: JulianDay.toDateTime(EphemerisSeconds.toJde(eventEs)),
          separation: minSeparation,
          positionAngle: NaN
        }
      });

    const eclipses = [...sunEclipses, ...moonEclipses]
      .filter(eclipse => eclipse.separation < DETAILED_ANGLE_RANGE)
      .sort((a, b) => a.jde - b.jde);

    eclipses.forEach(eclipse =>
      console.log(`${eclipse.type}: jde= ${eclipse.jde}, date=${JulianDay.toDateTime(eclipse.jde).toISOString()}, date range=${eclipse.eventTimeRangeWidthSeconds}, angle=${Radians.toDegrees(eclipse.separation)}°`)
    );

    return eclipses;
  }

};
