import type { JSX } from 'react';
import { useTheme } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { formatDegrees } from '../../utils';
import type { Separation } from '@/sdk/GetSeparations';

type SeparationsTablePropsType = {
  separations: Separation[];
}

export default function SeparationsTable({ separations }: SeparationsTablePropsType): JSX.Element {
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
            <TableCell align="right">Separation</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {separations.map((separation) => (
            <TableRow key={separation.jde} sx={{
              '&:last-child td, &:last-child th': { border: 0 },
              '& span': { display: 'block' }
            }}>
              <TableCell>
                <span>{separation.jde} (JDE)</span>
                <span><>{separation.tde} (TDE)</></span>
              </TableCell>
              <TableCell align="right">
                {formatDegrees(separation.separation)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
