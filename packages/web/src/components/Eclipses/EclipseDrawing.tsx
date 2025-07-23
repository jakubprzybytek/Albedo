import type { JSX } from "react";
import { EclipseType } from "@/sdk/Eclipses";
import type { Eclipse, MoonEclipse, SunEclipse } from "@/sdk/Eclipses";
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

function calculateScale(firstBodyRadius: number, secondBodyRadius: number, separation: number, positionAngleRad: number) {
  const longestDimention = (firstBodyRadius + separation + secondBodyRadius) * 1.2;
  const scale = 500 / longestDimention;

  const scaleXFactor = Math.sin(positionAngleRad) * scale;
  const scaleYFactor = Math.cos(positionAngleRad) * scale;

  const balance = firstBodyRadius - secondBodyRadius;
  const firstBodyBalancedSeparation = (separation - balance) / 2;
  const secondBodyBalancedSeparation = (separation + balance) / 2;

  const firstBodyX = 250 - firstBodyBalancedSeparation * scaleXFactor;
  const firstBodyY = 250 - firstBodyBalancedSeparation * scaleYFactor;
  const secondBodyX = 250 + secondBodyBalancedSeparation * scaleXFactor;
  const secondBodyY = 250 + secondBodyBalancedSeparation * scaleYFactor;

  return { scale, firstBodyX, firstBodyY, secondBodyX, secondBodyY }
}

export function SunEclipseDrawing({ eclipse }: { eclipse: SunEclipse }): JSX.Element {
  const sunRadius = eclipse.sunEphemeris.angularSizeDeg / 2;
  const moonRadius = eclipse.moonEphemeris.angularSizeDeg / 2;

  const positionAngle = calculatePositionAngle(eclipse.sunEphemeris.coords, eclipse.moonEphemeris.coords);
  const { scale, firstBodyX, firstBodyY, secondBodyX, secondBodyY } = calculateScale(sunRadius, moonRadius, eclipse.separation, positionAngle);

  return (
    <svg viewBox="0 0 500 500" style={{ backgroundColor: 'lightblue' }}>
      <g>
        <circle cx={firstBodyX} cy={firstBodyY} r={sunRadius * scale} fill='yellow'></circle>
        <circle cx={secondBodyX} cy={secondBodyY} r={moonRadius * scale} stroke="grey" strokeWidth="2" fill='#585858'></circle>
        <circle cx={firstBodyX} cy={firstBodyY} r={sunRadius * scale} stroke="orange" strokeWidth="2" fill='none'></circle>
      </g>
    </svg>
  );
}

function MoonEclipseDrawing({ eclipse }: { eclipse: MoonEclipse }) {
  const moonBodyRadius = eclipse.moonEphemeris.angularSizeDeg / 2.0;
  const earthUmbraRadius = eclipse.earthShadowEphemeris.umbraAngularSizeDeg / 2.0;
  const earthPenumbraRadius = eclipse.earthShadowEphemeris.penumbraAngularSizeDeg / 2.0;

  const positionAngle = calculatePositionAngle(eclipse.moonEphemeris.coords, eclipse.earthShadowEphemeris.coords);
  const { scale, firstBodyX, firstBodyY, secondBodyX, secondBodyY } = calculateScale(moonBodyRadius, earthPenumbraRadius, eclipse.separation, positionAngle);

  return (
    <svg viewBox="0 0 500 500" style={{ backgroundColor: 'darkblue' }}>
      <g>
        <circle cx={secondBodyX} cy={secondBodyY} r={earthPenumbraRadius * scale} fill='#787878'></circle>
        <circle cx={secondBodyX} cy={secondBodyY} r={earthUmbraRadius * scale} fill='#585858'></circle>
        <circle cx={firstBodyX} cy={firstBodyY} r={moonBodyRadius * scale} stroke="orange" strokeWidth="2" fill='silver'></circle>
        <circle cx={secondBodyX} cy={secondBodyY} r={earthUmbraRadius * scale} stroke="grey" strokeWidth="2" fill='none'></circle>
        <circle cx={secondBodyX} cy={secondBodyY} r={earthPenumbraRadius * scale} stroke="grey" strokeWidth="2" fill='none'></circle>
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
    return <MoonEclipseDrawing eclipse={eclipse} />;
  }

  return (
    <span>unknown eclipse type</span>
  );
}
