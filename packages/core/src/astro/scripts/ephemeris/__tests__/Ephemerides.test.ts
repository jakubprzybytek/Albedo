import { describe, it, expect } from "vitest";
import { EphemerisSeconds, JplBodyId } from "@jpl";
import { JulianDay } from "@astro";
import { Radians } from "@astro/coords";
import { Ephemerides2 } from "@astro/scripts";
import { kernelRepository } from "@jpl/data/de440.testData";

describe("Ephemerides", () => {

  const ephemerisScripts = new Ephemerides2(kernelRepository.stateSolver2());

  it("should compute single ephemeis for Venus", () => {
    const es = EphemerisSeconds.fromJde(JulianDay.fromDate(2019, 10, 10));
    const ephemeris = ephemerisScripts.single(JplBodyId.Venus, es);

    expect(Radians.toDegrees(ephemeris.rightAscension)).approximately(209.40961679, 1e-8);
    expect(Radians.toDegrees(ephemeris.declination)).toBeCloseTo(-11.36545552, 0);
  });

  it("should compute simple ephemeis for Venus", () => {
    const jde = JulianDay.fromDate(2019, 10, 10);
    const ephemeris = ephemerisScripts.simple(JplBodyId.Venus, jde, jde, 1);

    const { coords, ...mainProperties } = ephemeris[0];

    expect(mainProperties).toEqual({
      es: 623937600,
      jde: 2458766.5,
      tde: new Date('2019-10-10T00:00:00.000Z'),
    });

    expect(Radians.toDegrees(coords.rightAscension)).approximately(209.40961679, 1e-8);
    expect(Radians.toDegrees(coords.declination)).toBeCloseTo(-11.36545552, 0);
  });
});
