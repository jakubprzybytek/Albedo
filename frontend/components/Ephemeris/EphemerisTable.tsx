import { useTheme } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Ephemeris } from '@lambda/ephemeris';
import AstronomicalCoords from 'common/AstronomicalCoordinates';

type EphemerisTablePropsType = {
    ephemerides: Ephemeris[];
}

export default function EphemerisTable({ ephemerides }: EphemerisTablePropsType): JSX.Element {
    const theme = useTheme();

    return (
        <TableContainer component={Paper} sx={{
            backgroundColor: theme.palette.secondaryBackground,
            '& td, & th': { borderColor: theme.palette.background.default }
        }}>
            <Table size="small" aria-label="a dense table">
                <TableHead>
                    <TableRow>
                        <TableCell>Time</TableCell>
                        <TableCell align="center">Coordinates</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {ephemerides.map((ephemeris) => (
                        <TableRow key={ephemeris.jde} sx={{
                            '&:last-child td, &:last-child th': { border: 0 }
                        }}>
                            <TableCell>
                                <div>{ephemeris.jde} (JDE)</div>
                                <div>{ephemeris.ephemerisSeconds} [ES]</div>
                                <div><>{ephemeris.tde} (TDE)</></div>
                            </TableCell>
                            <TableCell align="right">
                                <AstronomicalCoords coords={ephemeris.coords} />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
