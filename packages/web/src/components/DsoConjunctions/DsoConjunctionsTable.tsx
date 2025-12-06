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
import DsoConjunctionDrawing from './DsoConjunctionDrawing';
import { type DsoConjunction, OpenNgcObjectType } from '@/sdk/Conjunctions';
import { AstronomicalCoordinates } from '@astro/coords';

function separationFactor(conjunction: DsoConjunction): number {
  const averageAngularSize = (conjunction.body.ephemeris.angularSize + (conjunction.dso.majorAxis + conjunction.dso.minorAxis) / 2) / 2;
  return conjunction.separation / averageAngularSize;
}

function formatOpenNGCObjectType(type: OpenNgcObjectType) {
  const enumIndex = Object.values(OpenNgcObjectType).indexOf(type);
  return enumIndex >= 0 ? Object.keys(OpenNgcObjectType)[enumIndex] : `${type}(?)`;
}

type DsoConjunctionsTablePropsType = {
  conjunctions: DsoConjunction[];
}

export default function DsoConjunctionsTable({ conjunctions }: DsoConjunctionsTablePropsType): JSX.Element {
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
            <TableCell align="center">Body</TableCell>
            <TableCell align="center">DSO</TableCell>
            <TableCell align="right">Separation</TableCell>
            <TableCell align="right">Drawing</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {conjunctions.map((conjunction) => (
            <TableRow key={`${conjunction.jde}-${conjunction.body.info.id}-${conjunction.dso.name}`} sx={{
              '&:last-child td, &:last-child th': { border: 0 },
              '& span': { display: 'block' }
            }}>
              <TableCell>
                <span>{conjunction.jde} (JDE)</span>
                <span><>{conjunction.tde} (TDE)</></span>
              </TableCell>
              <TableCell align="center">
                {conjunction.body.info.name}
                <AstronomicalCoords coords={conjunction.body.ephemeris.coords} />
                Size: {formatDegrees(conjunction.body.ephemeris.angularSize)}
              </TableCell>
              <TableCell align="center">
                {conjunction.dso.name} / {formatOpenNGCObjectType(conjunction.dso.type)}
                <AstronomicalCoords coords={new AstronomicalCoordinates(conjunction.dso.rightAscension, conjunction.dso.declination)} />
                Size: {formatDegrees(conjunction.dso.majorAxis)} / {formatDegrees(conjunction.dso.minorAxis)} / {formatDegrees(conjunction.dso.positionAngle)}
              </TableCell>
              <TableCell align="right">
                {formatDegrees(conjunction.separation)}
                <span>Sep. factor: {separationFactor(conjunction).toFixed(1)}</span>
              </TableCell>
              <TableCell align="right">
                <Box width="100px" height="100px" marginLeft="auto">
                  {/* <DsoConjunctionDrawing conjunction={conjunction} /> */}
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
