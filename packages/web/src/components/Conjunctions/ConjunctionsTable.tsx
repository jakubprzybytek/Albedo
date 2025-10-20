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
import { formatDegrees } from '../../utils';
import AstronomicalCoords from '@/common/AstronomicalCoordinates';
import ConjunctionDrawing from './ConjunctionDrawing';
import type { Conjunction } from '@/sdk/Conjunctions';

type ConjunctionsTablePropsType = {
  conjunctions: Conjunction[];
}

function separationFactor(conjunction: Conjunction): number {
  const averageAngularSize = (conjunction.firstBody.ephemeris.angularSizeDeg + conjunction.secondBody.ephemeris.angularSizeDeg) / 2;
  return conjunction.separation / averageAngularSize;
}

export default function ConjunctionsTable({ conjunctions }: ConjunctionsTablePropsType): JSX.Element {
  const theme = useTheme();

  return (
    <TableContainer component={Paper} sx={{
      width: 'auto',
      backgroundColor: theme.palette.grey[200],
      '& td, & th': { borderColor: theme.palette.background.default }
    }}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Time</TableCell>
            <TableCell align="center">First body</TableCell>
            <TableCell align="center">Second body</TableCell>
            <TableCell align="right">Separation</TableCell>
            <TableCell align="right">Drawing</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {conjunctions.map((conjunction) => (
            <TableRow key={`${conjunction.jde}-${conjunction.firstBody.info.id}-${conjunction.secondBody.info.id}`} sx={{
              '&:last-child td, &:last-child th': { border: 0 },
              '& span': { display: 'block' }
            }}>
              <TableCell>
                <span>{conjunction.jde} (JDE)</span>
                <span><>{conjunction.tde} (TDE)</></span>
              </TableCell>
              <TableCell align="center">
                {conjunction.firstBody.info.name}
                <AstronomicalCoords coords={conjunction.firstBody.ephemeris.coords} />
                Size: {formatDegrees(conjunction.firstBody.ephemeris.angularSizeDeg)}
              </TableCell>
              <TableCell align="center">
                {conjunction.secondBody.info.name}
                <AstronomicalCoords coords={conjunction.secondBody.ephemeris.coords} />
                Size: {formatDegrees(conjunction.secondBody.ephemeris.angularSizeDeg)}
              </TableCell>
              <TableCell align="right">
                {formatDegrees(conjunction.separation)}
                <span>Sep. factor: {separationFactor(conjunction).toFixed(1)}</span>
              </TableCell>
              <TableCell align="right">
                <Box width="100px" height="100px" marginLeft="auto">
                  <ConjunctionDrawing conjunction={conjunction} />
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
