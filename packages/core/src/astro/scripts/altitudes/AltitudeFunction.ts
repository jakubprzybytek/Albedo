import { Radians, RectangularCoordinates, type ObserverLocation } from '@astro/coords';
import type { Matrix3x3 } from '@astro/math';
import { JplBodyId } from '@jpl';
import { geodeticToRectangular } from '@jpl/coordinates';
import { Axis, RotationMatrix } from '@jpl/frames';
import type { KernelsRepository } from '@jpl/kernels';
import { CorrectionType } from '@jpl/state';
import type { AltitudeAt } from './SolarEvents';

/**
 * Builds a topocentric-altitude-only evaluator optimized for event finding
 * (rise, transit, set, and solar threshold crossings).
 *
 * Compared to `Ephemerides.buildFullCoordinatesFunction` it:
 * - skips RA/Dec, range, and angular-size computation,
 * - hoists all observer-constant work (geodetic position, topocentric rotation) out of the hot path,
 * - computes the Earth body-fixed rotation matrix once per instant and shares it
 *   between the parallax correction and the topocentric transform.
 *
 * Returns the apparent altitude in degrees.
 */
export function buildAltitudeFunction(
  kernels: KernelsRepository,
  bodyId: JplBodyId,
  observer: ObserverLocation,
): AltitudeAt {
  const stateSolver = kernels.stateSolver();
  const earthBodyFixedFrame = kernels.frames().bodyFixedFrame(JplBodyId.Earth);

  const earthGeometry = kernels.bodyGeometryProvider().getBodyRadii(JplBodyId.Earth);
  if (!earthGeometry) {
    throw new Error(`Cannot find body geometry for: bodyId='${JplBodyId.Earth}'`);
  }
  const equatorialRadius = earthGeometry[0];
  const flattening = (earthGeometry[0] - earthGeometry[2]) / earthGeometry[0];
  const observerBodyFixed = geodeticToRectangular(
    Radians.fromDegrees(observer.longitude),
    Radians.fromDegrees(observer.latitude),
    observer.altitude / 1000,
    equatorialRadius,
    flattening,
  ).toVector();

  const observerColatitude = 90 - observer.latitude;
  const topocentricRotationMatrix = RotationMatrix.eulerToMatrix(
    Radians.fromDegrees(-observer.latitude),
    Radians.fromDegrees(-observerColatitude),
    Radians.fromDegrees(180),
    Axis.Z, Axis.Y, Axis.Z,
  );

  return (es: number): number => {
    // Earth rotation matrix is computed once per instant and reused below.
    const earthRotation = earthBodyFixedFrame.getRotationMatrix(es);

    // Accuracy/performance trade-off: LIGHT_TIME (without stellar aberration) is used on
    // purpose. Aberration displaces the apparent position by at most ~20 arcseconds, which
    // shifts rise/transit/set times by ~1 second — far below the 60-second event bracket —
    // while skipping the observer-velocity chain and aberration rotation on every call.
    const geocentricPosition = stateSolver.position(bodyId, JplBodyId.Earth, es, CorrectionType.LIGHT_TIME).coords;

    const observerJ2000 = RotationMatrix.multiplyVector(RotationMatrix.invert(earthRotation), observerBodyFixed);
    const topocentricJ2000 = geocentricPosition.subtract(RectangularCoordinates.fromVector(observerJ2000));

    const bodyFixed = RotationMatrix.multiplyVector(earthRotation, topocentricJ2000.toVector());
    const [x, y, z] = RotationMatrix.multiplyVector(topocentricRotationMatrix, bodyFixed);

    return Radians.toDegrees(Math.atan2(z, Math.hypot(x, y)));
  };
}

/**
 * Builds altitude evaluators for multiple bodies sharing a single memoized Earth rotation
 * matrix per time step. This avoids recomputing `earthBodyFixedFrame.getRotationMatrix(es)`
 * once per body per sample, reducing the cost by approximately N-fold (N = number of bodies).
 * The observer's J2000 position (which also depends only on Earth's rotation and the fixed
 * observer geodetic coordinates) is memoized in the same way.
 *
 * Use this instead of calling `buildAltitudeFunction` once per body when evaluating multiple
 * bodies over the same sample-time grid.
 */
export function buildSharedAltitudeFunctions(
  kernels: KernelsRepository,
  bodyIds: readonly JplBodyId[],
  observer: ObserverLocation,
): Map<JplBodyId, AltitudeAt> {
  const stateSolver = kernels.stateSolver();
  const earthBodyFixedFrame = kernels.frames().bodyFixedFrame(JplBodyId.Earth);

  const earthGeometry = kernels.bodyGeometryProvider().getBodyRadii(JplBodyId.Earth);
  if (!earthGeometry) {
    throw new Error(`Cannot find body geometry for: bodyId='${JplBodyId.Earth}'`);
  }
  const equatorialRadius = earthGeometry[0];
  const flattening = (earthGeometry[0] - earthGeometry[2]) / earthGeometry[0];
  const observerBodyFixed = geodeticToRectangular(
    Radians.fromDegrees(observer.longitude),
    Radians.fromDegrees(observer.latitude),
    observer.altitude / 1000,
    equatorialRadius,
    flattening,
  ).toVector();

  const observerColatitude = 90 - observer.latitude;
  const topocentricRotationMatrix = RotationMatrix.eulerToMatrix(
    Radians.fromDegrees(-observer.latitude),
    Radians.fromDegrees(-observerColatitude),
    Radians.fromDegrees(180),
    Axis.Z, Axis.Y, Axis.Z,
  );

  // Shared per-instant caches — populated on the first body evaluated at each es and
  // reused by all subsequent bodies at the same instant.
  const rotationCache = new Map<number, Matrix3x3>();
  const observerJ2000Cache = new Map<number, ReturnType<typeof RotationMatrix.multiplyVector>>();

  const getEarthRotation = (es: number): Matrix3x3 => {
    const cached = rotationCache.get(es);
    if (cached) return cached;
    const rotation = earthBodyFixedFrame.getRotationMatrix(es);
    rotationCache.set(es, rotation);
    return rotation;
  };

  const getObserverJ2000 = (es: number) => {
    const cached = observerJ2000Cache.get(es);
    if (cached) return cached;
    const earthRotation = getEarthRotation(es);
    const result = RotationMatrix.multiplyVector(RotationMatrix.invert(earthRotation), observerBodyFixed);
    observerJ2000Cache.set(es, result);
    return result;
  };

  return new Map(bodyIds.map(bodyId => [bodyId, (es: number): number => {
    const earthRotation = getEarthRotation(es);
    const geocentricPosition = stateSolver.position(bodyId, JplBodyId.Earth, es, CorrectionType.LIGHT_TIME).coords;
    const topocentricJ2000 = geocentricPosition.subtract(RectangularCoordinates.fromVector(getObserverJ2000(es)));
    const bodyFixed = RotationMatrix.multiplyVector(earthRotation, topocentricJ2000.toVector());
    const [x, y, z] = RotationMatrix.multiplyVector(topocentricRotationMatrix, bodyFixed);
    return Radians.toDegrees(Math.atan2(z, Math.hypot(x, y)));
  }]));
}
