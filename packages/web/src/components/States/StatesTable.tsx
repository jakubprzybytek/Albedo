import type { JSX } from 'react';
import { useTheme } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { formatDuration, intervalToDuration } from 'date-fns';
import { RectangularCoordinates } from "@astro/coords";
import type { StateResult } from '@/sdk/States';

const decimalFormat = new Intl.NumberFormat('pl-PL')

type VectoryDisplayPropsType = {
  coords: RectangularCoordinates;
}

function VectorDisplay({ coords }: VectoryDisplayPropsType): JSX.Element {
  return (
    <>
      <span>x: {coords.x.toFixed(6)}</span>
      <span>y: {coords.y.toFixed(6)}</span>
      <span>z: {coords.z.toFixed(6)}</span>
    </>
  );
}

type StatesTablePropsType = {
  states: StateResult[];
}

export default function StatesTable({ states }: StatesTablePropsType): JSX.Element {
  const theme = useTheme();

  return (
    <TableContainer component={Paper} sx={{
      width: 'auto',
      backgroundColor: theme.palette.grey[200],
      '& td, & th': { borderColor: theme.palette.grey[400] }
    }}>
      <Table size="small" aria-label="a dense table">
        <TableHead>
          <TableRow>
            <TableCell>Time</TableCell>
            <TableCell align="center">Position [Km]</TableCell>
            <TableCell align="center">Distance [Km]</TableCell>
            <TableCell align="center">Velocity [Km/s]</TableCell>
            <TableCell align="center">Speed [Km/s]</TableCell>
            <TableCell align="right">Light time</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {states.map((state) => (
            <TableRow key={state.jde} sx={{
              '&:last-child td, &:last-child th': { border: 0 },
              '& span': { display: 'block' }
            }}>
              <TableCell>
                <span>{state.es} [ES]</span>
                <span>{state.jde} (JDE)</span>
                <span><>{state.tde} (TDE)</></span>
              </TableCell>
              <TableCell align="center">
                <VectorDisplay coords={state.position} />
              </TableCell>
              <TableCell align="center">
                <span>{state.distanceAU.toFixed(2)} AU</span>
                <span>{decimalFormat.format(state.distance)} km</span>                
                <span>({state.distance} km)</span>                
              </TableCell>
              <TableCell align="center">
                <VectorDisplay coords={state.velocity} />
              </TableCell>
              <TableCell align="center">
                {state.speed.toFixed(6)}
              </TableCell>
              <TableCell align="right">
                <span>{formatDuration(intervalToDuration({ start: 0, end: (state.lightTime ?? 0) * 1000 }))}</span>
                <span>({state.lightTime} s)</span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
