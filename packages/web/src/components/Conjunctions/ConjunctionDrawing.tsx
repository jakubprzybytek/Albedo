import type { JSX } from "react";
import { calculatePositionAngle, calculateDrawingScale } from "@/common/drawings";
import type { Conjunction } from "@astro/scripts";

type ConjunctionDrawingPropsType = {
  conjunction: Conjunction;
}

export default function ConjunctionDrawing({ conjunction }: ConjunctionDrawingPropsType): JSX.Element {
  const firstBodyRadius = conjunction.firstBody.ephemeris.angularSizeDeg / 2;
  const secondBodyRadius = conjunction.secondBody.ephemeris.angularSizeDeg / 2;

  const positionAngle = calculatePositionAngle(conjunction.firstBody.ephemeris.coords, conjunction.secondBody.ephemeris.coords);
  const { scale, firstBodyX, firstBodyY, secondBodyX, secondBodyY } = calculateDrawingScale(firstBodyRadius, secondBodyRadius, conjunction.separation, positionAngle);

  return (
    <svg viewBox="0 0 500 500" style={{ backgroundColor: 'darkblue', height: '100%' }}>
      <g>
        <circle cx={firstBodyX} cy={firstBodyY} r={firstBodyRadius * scale} fill='lightgrey'></circle>
        <circle cx={secondBodyX} cy={secondBodyY} r={secondBodyRadius * scale} fill='lightgrey'></circle>
      </g>
    </svg>
  );
}
