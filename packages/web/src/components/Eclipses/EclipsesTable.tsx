import type { JSX } from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import AstronomicalCoords from '@/common/AstronomicalCoordinates';
import { formatDegrees } from '../../utils';
import { EclipseType } from '@/sdk/Eclipses';
import type { Eclipse, MoonEclipse, SunEclipse } from '@/sdk/Eclipses';
import EclipseDrawing from './EclipseDrawing';

type EclipsesTablePropsType = {
  eclipses: Eclipse[];
}

function SunEclipseCells({ eclipse }: { eclipse: SunEclipse }) {
  return (
    <>
      <TableCell>
        <AstronomicalCoords coords={eclipse.sunEphemeris.coords} />
        <div>Angular size: {formatDegrees(eclipse.sunEphemeris.angularSizeDeg)}</div>
      </TableCell>
      <TableCell>
        <AstronomicalCoords coords={eclipse.moonEphemeris.coords} />
        <div>Angular size: {formatDegrees(eclipse.moonEphemeris.angularSizeDeg)}</div>
      </TableCell>
    </>
  );
}

function MoonEclipseCells({ eclipse }: { eclipse: MoonEclipse }) {
  return (
    <>
      <TableCell>
        <AstronomicalCoords coords={eclipse.moonEphemeris.coords} />
        <div>Angular size: {formatDegrees(eclipse.moonEphemeris.angularSizeDeg)}</div>
      </TableCell>
      <TableCell>
        <AstronomicalCoords coords={eclipse.earthShadowEphemeris.coords} />
        <div>Umbra angular size: {formatDegrees(eclipse.earthShadowEphemeris.umbraAngularSizeDeg)}</div>
        <div>Penumbra angular size: {formatDegrees(eclipse.earthShadowEphemeris.penumbraAngularSizeDeg)}</div>
      </TableCell>
    </>
  );
}

export default function EclipsesTable({ eclipses }: EclipsesTablePropsType): JSX.Element {
  const theme = useTheme();

  return (
    <TableContainer component={Paper} sx={{
      width: 'auto',
      backgroundColor: theme.palette.grey[200],
      '& td, & th': { borderColor: theme.palette.background.default }
    }}>
      <Table size="small" aria-label="a dense table">
        <TableHead>
          <TableRow>
            <TableCell>Type</TableCell>
            <TableCell align="center">Time</TableCell>
            <TableCell align="center">Sun / Moon Ephemeris</TableCell>
            <TableCell align="center">Moon / Earthshadow Ephemeris</TableCell>
            <TableCell align="center">Separation</TableCell>
            <TableCell align="right">Drawing</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {eclipses.map((eclipse) => (
            <TableRow key={eclipse.jde} sx={{
              '&:last-child td, &:last-child th': { border: 0 }
            }}>
              <TableCell>
                {eclipse.type}
              </TableCell>
              <TableCell>
                <div>{eclipse.jde} (JDE)</div>
                <div><>{eclipse.tde} (TDE)</></div>
              </TableCell>
              {eclipse.type === EclipseType.SunEclipse && <SunEclipseCells eclipse={eclipse} />}
              {eclipse.type === EclipseType.MoonEclipse && <MoonEclipseCells eclipse={eclipse} />}
              <TableCell align="left">
                <div>{eclipse.separation.toFixed(9)}°</div>
                <div>{formatDegrees(eclipse.separation)}</div>
              </TableCell>
              <TableCell align="right">
                <Box width="100px" height="100px" marginLeft="auto">
                  <EclipseDrawing eclipse={eclipse} />
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
