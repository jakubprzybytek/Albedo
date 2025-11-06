import type { JSX } from 'react';
import { useTheme } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import AstronomicalCoords from '../../common/AstronomicalCoordinates';
import type { EphemerisWithAdjustedVelocity } from './EphemerisBrowser';
import Angle from '@/common/Angle';
import { decimalFormat } from '@/utils';

type EphemerisTablePropsType = {
  ephemerides: EphemerisWithAdjustedVelocity[];
}

export default function EphemerisTable({ ephemerides }: EphemerisTablePropsType): JSX.Element {
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
            <TableCell>Time</TableCell>
            <TableCell align="center">Coordinates</TableCell>
            <TableCell align="center">Range</TableCell>
            <TableCell align="center">Angular Size</TableCell>
            <TableCell align="center">Velocity</TableCell>
            <TableCell align="right">Velocity per Interval</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {ephemerides.map((ephemeris) => (
            <TableRow key={ephemeris.jde} sx={{
              '&:last-child td, &:last-child th': { border: 0 }
            }}>
              <TableCell>
                <div>{ephemeris.jde} (JDE)</div>
                <div>{ephemeris.es} [ES]</div>
                <div><>{ephemeris.tde} (TDE)</></div>
              </TableCell>
              <TableCell align="left">
                <AstronomicalCoords coords={ephemeris.coords} />
              </TableCell>
              <TableCell align="center">
                {/* <span>{state.distanceAU.toFixed(2)} AU</span> */}
                <div>{decimalFormat.format(ephemeris.range)} km</div>
                <div>({ephemeris.range} km)</div>
              </TableCell>
              <TableCell align="right">
                <Angle value={ephemeris.angularSize} />
              </TableCell>
              <TableCell align="right">
                <AstronomicalCoords format='scientific' coords={ephemeris.velocity} />
              </TableCell>
              <TableCell align="right">
                <AstronomicalCoords coords={ephemeris.velocityPerInterval} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
