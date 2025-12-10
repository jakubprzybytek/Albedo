import type { JSX } from "react";
import { AstronomicalCoordinates } from "@astro/coords";
import { formatHourAngle, formatDegrees } from '../utils';
import Typography from "@mui/material/Typography";

type FormatMode = 'standard' | 'compact' | 'scientific' | 'verbose';

type AstronomicalCoordsPropsType = {
  coords: AstronomicalCoordinates;
  format?: FormatMode; // Formatting mode: 'standard' (default), 'compact' for decimal, 'scientific' for scientific notation
}

export default function AstronomicalCoords({ coords, format }: AstronomicalCoordsPropsType): JSX.Element {
  // Handle backwards compatibility with compact boolean

  if (format === 'verbose') {
    return (
      <>
        <div>R.A.: {formatHourAngle(coords.rightAscension)} ({coords.rightAscension.toFixed(6)}°)</div>
        <div>Dec.: {formatDegrees(coords.declination)} ({coords.declination.toFixed(6)}°)</div>
      </>
    );
  }

  if (format === 'scientific') {
    // Scientific notation format for very small numbers
    return (
      <>
        <div>R.A.: {coords.rightAscension.toExponential(6)}°</div>
        <div>Dec.: {coords.declination.toExponential(6)}°</div>
      </>
    );
  }

  if (format === 'compact') {
    // Compact format suitable for small numbers like velocities
    return (
      <>
        <div>R.A.: {coords.rightAscension.toFixed(8)}°</div>
        <div>Dec.: {coords.declination.toFixed(8)}°</div>
      </>
    );
  }

  // Standard format for regular coordinates
  return (
    <>
      <Typography component="span" noWrap>R.A.: {formatHourAngle(coords.rightAscension)}
      </Typography> <Typography component="span" noWrap>Dec.: {formatDegrees(coords.declination)}</Typography>
    </>
  );
}
