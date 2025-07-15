import type { JSX } from "react";
import { EclipseType, type Eclipse } from "@/sdk/Eclipses";
import type { CommonEclipseProperties, SunEclipse } from "@astro/scripts";
import type { AstronomicalCoordinates } from "@astro/coords";

function calculatePositionAngle(firstBodyCoords: AstronomicalCoordinates, secondBodyCoords: AstronomicalCoordinates): number {
  const firstRaRad = firstBodyCoords.rightAscension / 180 * Math.PI;
  const firstDecRad = firstBodyCoords.declination / 180 * Math.PI;
  const secondRaRad = secondBodyCoords.rightAscension / 180 * Math.PI;
  const secondDecRad = secondBodyCoords.declination / 180 * Math.PI;

  return Math.atan2(
    Math.sin(firstRaRad - secondRaRad),
    Math.cos(secondDecRad) * Math.tan(firstDecRad) - Math.sin(secondDecRad) * Math.cos(firstRaRad - secondRaRad));
}

function calculateScale(firstBodyRadius: number, secondBodyRadius: number, separation: number, positionAngleRad: number): { scale: number, x: number, y: number } {
  const longestDimention = (firstBodyRadius + separation + secondBodyRadius) * 1.2;
  const scale = 500 / longestDimention;

  const x = separation * Math.sin(positionAngleRad) / 2 * scale;
  const y = separation * Math.cos(positionAngleRad) / 2 * scale;

  return { scale, x, y }
}

type SunEclipseDrawingPropsType = {
  eclipse: SunEclipse & CommonEclipseProperties;
}

export function SunEclipseDrawing({ eclipse }: SunEclipseDrawingPropsType): JSX.Element {
  const sunRadius = eclipse.sunEphemeris.angularSize / 2;
  const moonRadius = eclipse.moonEphemeris.angularSize / 2;

  const positionAngle = calculatePositionAngle(eclipse.sunEphemeris.coords, eclipse.moonEphemeris.coords);
  const { scale, x, y } = calculateScale(sunRadius, moonRadius, eclipse.separation, positionAngle);

  console.log({
    sunRadius,
    moonRadius,
    positionAngle,
    separation: eclipse.separation,
    scale,
    x,
    y,
  });

  return (
    <svg viewBox="0 0 500 500" style={{ backgroundColor: 'lightblue' }}>
      <g>
        <circle cx={250 - x} cy={250 - y} r={sunRadius * scale} stroke="orange" strokeWidth="2" fill='yellow'></circle>
        <circle cx={250 + x} cy={250 + y} r={moonRadius * scale} stroke="grey" strokeWidth="2" fill='#585858'></circle>
      </g>
    </svg>
  );
}

type EclipseDrawingPropsType = {
  eclipse: Eclipse;
}

export default function EclipseDrawing({ eclipse }: EclipseDrawingPropsType): JSX.Element {
  if (eclipse.type === EclipseType.SunEclipse) {
    return <SunEclipseDrawing eclipse={eclipse} />;
  } else if (eclipse.type === EclipseType.MoonEclipse) {
    return (
      <span>moon eclipse drawing</span>
    )
  }

  return (
    <span>unknown eclipse type</span>
  );
}
