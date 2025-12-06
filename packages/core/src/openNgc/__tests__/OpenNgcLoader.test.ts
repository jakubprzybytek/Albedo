import { describe, it, expect } from "vitest";
import { parseAngleInDegree, parseObject } from "../OpenNgcLoader";
import { OpenNgcObject, OpenNgcObjectType } from "..";
import { AstronomicalCoordinates, Radians } from "@astro/coords";

describe("OpenNgcLoader", () => {
  it("should parse anges", () => {
    expect(parseAngleInDegree('+00:12:36.36')).toBe(0.2101);
    expect(parseAngleInDegree('+27:12:36.36')).toBe(27.2101);
    expect(parseAngleInDegree('-03:36:12')).toBe(-3.6033333333333335);
  });

  it("should parse OpenNGC object", () => {
    const line = 'IC0002;G;00:11:00.88;-12:49:22.3;Cet;0.98;0.32;142;15.46;;12.26;11.48;11.17;23.45;Sb;;;;6775;0.022860;;;;;;;;2MASX J00110081-1249206,IRAS 00084-1306,MCG -02-01-031,PGC 000778;;;;Type:1|RA:1|Dec:1|Const:99|MajAx:3|MinAx:3|PosAng:3|B-Mag:3|J-Mag:2|H-Mag:2|K-Mag:2|SurfBr:3|Hubble:3|RadVel:2|Redshift:2';
    expect(parseObject(line)).toEqual<OpenNgcObject>({
      name: 'IC0002',
      type: OpenNgcObjectType.Galaxy,
      rightAscension: Radians.fromDegrees(2.7536666666666663),
      rightAscensionDeg: 2.7536666666666663,
      declination: Radians.fromDegrees(-12.822861111111111),
      declinationDeg: -12.822861111111111,
      majorAxis: Radians.fromDegrees(0.98 / 60),
      minorAxis: Radians.fromDegrees(0.32 / 60),
      positionAngle: 2.478367537831948,
      positionAngleDeg: 142
    })

    const line2 = 'NGC7800;G;23:59:36.32;+14:48:20.1;Peg;1.74;0.72;45;13.31;;12.14;11.58;11.27;22.65;IB;;;;1696;0.005672;;;;;;;;2MASX J23593630+1448200,IRAS 23570+1431,MCG +02-01-007,PGC 073177,UGC 12885;;;;Type:1|RA:1|Dec:1|Const:99|MajAx:3|MinAx:3|PosAng:3|B-Mag:3|J-Mag:2|H-Mag:2|K-Mag:2|SurfBr:3|Hubble:3|RadVel:2|Redshift:2';
    expect(parseObject(line2)).toEqual<OpenNgcObject>({
      name: 'NGC7800',
      type: OpenNgcObjectType.Galaxy,
      rightAscension: Radians.fromDegrees(359.90133333333335),
      rightAscensionDeg: 359.90133333333335,
      declination: Radians.fromDegrees(14.805583333333335),
      declinationDeg: 14.805583333333335,
      majorAxis: Radians.fromDegrees(1.74 / 60),
      minorAxis: Radians.fromDegrees(0.72 / 60),
      positionAngle: 0.7853981633974483,
      positionAngleDeg: 45
    })

    const line3 = 'IC1593;**;00:54:39.63;+32:31:10.1;Psc;;;;;;;;;;;;;;;;;;;;;;;;;;;Type:1|RA:1|Dec:1|Const:99';
    expect(parseObject(line3)).toEqual<OpenNgcObject>({
      name: 'IC1593',
      type: OpenNgcObjectType.Unknown,
      rightAscension: Radians.fromDegrees(13.665125),
      rightAscensionDeg: 13.665125,
      declination: Radians.fromDegrees(32.51947222222222),
      declinationDeg: 32.51947222222222,
      majorAxis: undefined,
      minorAxis: undefined,
      positionAngle: undefined,
      positionAngleDeg: undefined
    })
  });
});
