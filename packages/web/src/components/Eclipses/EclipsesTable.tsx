import type { JSX } from 'react';
import { useTheme } from '@mui/material/styles';
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
import { type Eclipse } from '@/sdk/Eclipses';
import EclipseDrawing from './EclipseDrawing';

type EclipsesTablePropsType = {
  eclipses: Eclipse[];
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
            <TableCell align="center">Sun Ephemeris</TableCell>
            <TableCell align="center">Moon / Moonshadow Ephemeris</TableCell>
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
              <TableCell>
                <AstronomicalCoords coords={eclipse.sunEphemeris.coords} />
              </TableCell>
              <TableCell>
                {eclipse.type === EclipseType.SunEclipse && <AstronomicalCoords coords={eclipse.moonEphemeris.coords} />}
                {eclipse.type === EclipseType.MoonEclipse && <AstronomicalCoords coords={eclipse.moonShadowEphemeris.coords} />}
              </TableCell>
              <TableCell align="right">
                {formatDegrees(eclipse.separation)}
              </TableCell>
              <TableCell>
                <div style={{ width: '100px', height: '100px' }}>
                  <EclipseDrawing eclipse={eclipse} />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
