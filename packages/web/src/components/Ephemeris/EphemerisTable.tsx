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
import type { DetailedEphemeris } from '@/sdk/Ephemerides';
import Angle from '@/common/Angle';

type EphemerisTablePropsType = {
  ephemerides: DetailedEphemeris[];
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
            <TableCell align="right">Angular Size</TableCell>
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
              <TableCell align="right">
                <Angle value={ephemeris.angularSizeDeg} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
