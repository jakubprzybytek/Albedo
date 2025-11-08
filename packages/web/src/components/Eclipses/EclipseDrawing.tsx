import type { JSX } from "react";
import { EclipseType } from "@/sdk/Eclipses";
import type { Eclipse, MoonEclipse, SunEclipse } from "@/sdk/Eclipses";
import { calculatePositionAngle, calculateDrawingScale } from "@/common/drawings";

export function SunEclipseDrawing({ eclipse }: { eclipse: SunEclipse }): JSX.Element {
  const sunRadius = eclipse.sunEphemeris.angularSize / 2;
  const moonRadius = eclipse.moonEphemeris.angularSize / 2;

  const positionAngle = calculatePositionAngle(eclipse.sunEphemeris.coords, eclipse.moonEphemeris.coords);
  const { scale, firstBodyX, firstBodyY, secondBodyX, secondBodyY } = calculateDrawingScale(sunRadius, moonRadius, eclipse.separation, positionAngle);

  return (
    <svg viewBox="0 0 500 500" style={{ borderRadius: '4px', backgroundColor: 'lightblue', height: '100%' }}>
      <g>
        <circle cx={firstBodyX} cy={firstBodyY} r={sunRadius * scale} fill='yellow'></circle>
        <circle cx={secondBodyX} cy={secondBodyY} r={moonRadius * scale} stroke="grey" strokeWidth="2" fill='#585858'></circle>
        <circle cx={firstBodyX} cy={firstBodyY} r={sunRadius * scale} stroke="orange" strokeWidth="2" fill='none'></circle>
      </g>
    </svg>
  );
}

function MoonEclipseDrawing({ eclipse }: { eclipse: MoonEclipse }) {
  const moonBodyRadius = eclipse.moonEphemeris.angularSize / 2.0;
  const earthUmbraRadius = eclipse.earthShadowEphemeris.umbraAngularSize / 2.0;
  const earthPenumbraRadius = eclipse.earthShadowEphemeris.penumbraAngularSize / 2.0;

  const positionAngle = calculatePositionAngle(eclipse.moonEphemeris.coords, eclipse.earthShadowEphemeris.coords);
  const { scale, firstBodyX, firstBodyY, secondBodyX, secondBodyY } = calculateDrawingScale(moonBodyRadius, earthPenumbraRadius, eclipse.separation, positionAngle);

  return (
    <svg viewBox="0 0 500 500" style={{ borderRadius: '4px', backgroundColor: 'darkblue', height: '100%' }}>
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
