import { Radians, RectangularCoordinates, type ObserverLocation } from '@astro/coords';
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
