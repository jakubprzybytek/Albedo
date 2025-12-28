import type { JSX } from "react";
import { AzAltCoordinates } from "@astro/coords";
import { formatDegrees } from '../utils';
import Typography from "@mui/material/Typography";

type FormatMode = 'standard' | 'compact' | 'verbose';

type AzAltCoordsPropsType = {
  coords: AzAltCoordinates;
  format?: FormatMode;
}

export default function AzAltCoords({ coords, format }: AzAltCoordsPropsType): JSX.Element {

  if (format === 'verbose') {
    return (
      <>
        <div>Az: {formatDegrees(coords.azimuth)} ({coords.azimuth.toFixed(6)}°)</div>
        <div>Alt: {formatDegrees(coords.altitude)} ({coords.altitude.toFixed(6)}°)</div>
      </>
    );
  }

  if (format === 'compact') {
    // Compact format suitable for small numbers like velocities
    return (
      <>
        <div>Az: {coords.azimuth.toFixed(8)}°</div>
        <div>Alt: {coords.altitude.toFixed(8)}°</div>
      </>
    );
  }

  // Standard format for regular coordinates
  return (
    <>
      <Typography component="span" noWrap>Az: {formatDegrees(coords.azimuth)}
      </Typography> <Typography component="span" noWrap>Alt: {formatDegrees(coords.altitude)}</Typography>
    </>
  );
}
