import { describe, it, expect } from "vitest";
import { EphemerisSeconds, JplBodyId } from "@jpl";
import { JulianDay } from "@astro";
import { Radians } from "@astro/coords";
import { DetailedEphemeris, Ephemerides } from "@astro/scripts";
import { kernels } from "@jpl/data/kernels.testData";

describe("Ephemerides", () => {

  const ephemerisScripts = new Ephemerides(kernels.stateSolver());

  it("should compute astronomical coodinates for Venus", () => {
    const es = EphemerisSeconds.fromDate(2019, 10, 10);
    const ephemeris = ephemerisScripts.coordinatesForBody(JplBodyId.Venus, es);

    expect(Radians.toDegrees(ephemeris.rightAscension)).approximately(209.39848483, 3e-9);
    expect(Radians.toDegrees(ephemeris.declination)).toBeCloseTo(-11.36105059, 0);
  });

  it("should compute detailed astronomical coodinates for Venus", () => {
    const es = EphemerisSeconds.fromDate(2019, 10, 10);
    const ephemeris = ephemerisScripts.detailedCoordinatesForBody(JplBodyId.Venus, es);

    expect(Radians.toDegrees(ephemeris.coords.rightAscension)).approximately(209.39848483, 3e-9);
    expect(Radians.toDegrees(ephemeris.coords.declination)).toBeCloseTo(-11.36105059, 0);

    expect(Radians.toDegrees(ephemeris.angularSizeDeg)).toEqual(0.16206301512330895);
  });

  it("should compute simple ephemeis for Venus", () => {
    const jde = JulianDay.fromDate(2019, 10, 10);
    const ephemeris = ephemerisScripts.simple(JplBodyId.Venus, jde, jde, 1);

    const { coords, ...mainProperties } = ephemeris[0];

    expect(mainProperties).toEqual({
      es: 623937600,
      jde: 2458766.5,
      tde: new Date('2019-10-10T00:00:00.000Z'),
      angularSizeDeg: 0.002828533209611105
    } as Omit<DetailedEphemeris, 'coords'>);

    expect(Radians.toDegrees(coords.rightAscension)).approximately(209.39848483, 3e-9);
    expect(Radians.toDegrees(coords.declination)).toBeCloseTo(-11.36105059, 0);
  });
});
