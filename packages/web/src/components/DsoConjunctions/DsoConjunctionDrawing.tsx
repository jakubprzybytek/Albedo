import type { JSX } from "react";
import { calculatePositionAngle, calculateDrawingScale } from "@/common/drawings";
import { AstronomicalCoordinates } from "@astro/coords";
import type { DsoConjunction } from "@/sdk/Conjunctions";

type DsoConjunctionDrawingPropsType = {
  conjunction: DsoConjunction;
}

export default function DsoConjunctionDrawing({ conjunction }: DsoConjunctionDrawingPropsType): JSX.Element {
  const firstBodyRadius = conjunction.body.ephemeris.angularSize / 2;
  const secondBodyRadius = conjunction.dso.majorAxis / 2;

  const dsoCoords = new AstronomicalCoordinates(conjunction.dso.rightAscension, conjunction.dso.declination);

  const positionAngle = calculatePositionAngle(conjunction.body.ephemeris.coords, dsoCoords);
  const { scale, firstBodyX, firstBodyY, secondBodyX, secondBodyY } = calculateDrawingScale(firstBodyRadius, secondBodyRadius, conjunction.separation, positionAngle);

  return (
    <svg viewBox="0 0 500 500" style={{ borderRadius: '4px', backgroundColor: 'darkblue', height: '100%' }}>
      <g>
        <circle cx={secondBodyX} cy={secondBodyY} r={secondBodyRadius * scale} fill='lightblue'></circle>
        <circle cx={firstBodyX} cy={firstBodyY} r={firstBodyRadius * scale} fill='lightgrey'></circle>
      </g>
    </svg>
  );
}
