import { AstronomicalCoordinates, Radians } from "@astro/coords";
import { localMinimum } from "@astro/math/extremums/localMinimumUsingGoldenRatio";
import { timeProperties } from "@astro/scripts/utils/time";
import { JplBodyId } from "@jpl";
import { StateSolver, CorrectionType } from "@jpl/state";
import { EclipseType, MoonEclipse } from "..";
import { Bodies } from "src/catalogues/Bodies";

function buildEarthsShadowAndMoonAngle(stateSolver: StateSolver) {
  return (es: number) => {
    const sunPosition = stateSolver.positionFor(JplBodyId.Sun, JplBodyId.Earth, es, CorrectionType.NONE);
    const earthsShadowPosition = sunPosition.negate();

    const moonPosition = stateSolver.positionFor(JplBodyId.Moon, JplBodyId.Earth, es, CorrectionType.NONE);

    return Radians.between(moonPosition, earthsShadowPosition);
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

export function findMoonEclipses(stateSolver: StateSolver, fromEs: number, toEs: number): MoonEclipse {
  const earthsShadowAndMoonAngle = buildEarthsShadowAndMoonAngle(stateSolver);

  const midPointEs = fromEs + (toEs - fromEs) / 2;
  const [eventEs, minSeparation] = localMinimum(earthsShadowAndMoonAngle, fromEs, midPointEs, toEs, { maxResultRangeWidth: 10, maxIterations: 30 });

  return {
    type: EclipseType.MoonEclipse,
    ...timeProperties(eventEs),
    ...computeMoonAndEarthShadowEphemeris(stateSolver, eventEs),
    separation: minSeparation,
  }
}
