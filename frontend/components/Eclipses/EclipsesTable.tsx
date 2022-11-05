import { useTheme } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Eclipse } from '@lambda/eclipses';
import { formatDegrees } from 'utils';

type EclipsesTablePropsType = {
    eclipses: Eclipse[];
}

export default function EclipsesTable({ eclipses }: EclipsesTablePropsType): JSX.Element {
    const theme = useTheme();

    return (
        <TableContainer component={Paper} sx={{
            width: 'auto',
            backgroundColor: theme.palette.secondaryBackground,
            '& td, & th': { borderColor: theme.palette.background.default }
        }}>
            <Table size="small" aria-label="a dense table">
                <TableHead>
                    <TableRow>
                        <TableCell>Time</TableCell>
                        <TableCell align="center">Separation</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {eclipses.map((eclipse) => (
                        <TableRow key={eclipse.jde} sx={{
                            '&:last-child td, &:last-child th': { border: 0 }
                        }}>
                            <TableCell>
                                <div>{eclipse.jde} (JDE)</div>
                                <div><>{eclipse.tde} (TDE)</></div>
                            </TableCell>
                            <TableCell align="right">
                            {formatDegrees(eclipse.separation)}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
