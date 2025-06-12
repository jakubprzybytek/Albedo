import { Radians } from "@astro/coords";
import { Ephemerides, Ephemeris } from "@astro/scripts/ephemeris";
import { JplBody } from "@jpl";
import { StateWithPosition } from "@jpl/state";
import { Separation, SeparationWithBodies, SimpleSeparation } from '.';

/**
 * @deprecated The method should not be used
 */
export class Separations {
  static fromEphemerides(firstBodyEphemerides: Ephemeris[], secondBodyEphemerides: Ephemeris[]): Separation[] {
    return firstBodyEphemerides
      .map((firstBodyEphemeris, index) => {
        const secondBodyEphemeris = secondBodyEphemerides[index];
        return {
          jde: firstBodyEphemeris.jde,
          firstBodyEphemeris: firstBodyEphemeris,
          secondBodyEphemeris: secondBodyEphemeris,
          separation: Radians.separation(firstBodyEphemeris.coords, secondBodyEphemeris.coords)
        }
      });
  }

  static fromPositions(firstBodyPositions: StateWithPosition[], secondBodyPositions: StateWithPosition[]): SimpleSeparation[] {
    return firstBodyPositions
      .map((firstBodyPositions, index) => {
        const secondBodyPosition = secondBodyPositions[index];
        return {
          jde: firstBodyPositions.jde,
          separation: Radians.between(firstBodyPositions.position, secondBodyPosition.position)
        }
      });
  }

  static for(firstBody: JplBody, secondBody: JplBody, fromJde: number, toJde: number, interval: number): SeparationWithBodies[] {
    const firstBodyEphemerides = Ephemerides.simple(firstBody.id, fromJde, toJde, interval);
    const secondBodyEphemerides = Ephemerides.simple(secondBody.id, fromJde, toJde, interval);

    return firstBodyEphemerides
      .map((firstBodyEphemeris, index) => {
        const secondBodyEphemeris = secondBodyEphemerides[index]
        return {
          jde: firstBodyEphemeris.jde,
          tde: firstBodyEphemeris.tde,
          firstBody: {
            info: firstBody,
            ephemeris: firstBodyEphemeris
          },
          secondBody: {
            info: secondBody,
            ephemeris: secondBodyEphemeris
          },
          separation: Radians.separation(firstBodyEphemeris.coords, secondBodyEphemeris.coords)
        }
      });
  }
};
