import { useTheme } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { AstronomicalCoordinates } from "@math";
import { Ephemeris } from '@lambda/ephemeris';
import { formatHourAngle, formatDegrees} from '../Utils';

type AstroCoordsPropsType = {
    coords: AstronomicalCoordinates;
}

function AstroCoords({ coords }: AstroCoordsPropsType): JSX.Element {
    return (
        <>
            <span>R.A.: {formatHourAngle(coords.rightAscension)} ({coords.rightAscension.toFixed(6)}°)</span>
            <span>Dec.: {formatDegrees(coords.declination)} ({coords.declination.toFixed(6)}°)</span>
        </>
    );
}

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
                            '&:last-child td, &:last-child th': { border: 0 },
                            '& span': { display: 'block' }
                        }}>
                            <TableCell>
                                <span>{ephemeris.jde} (JDE)</span>
                                <span>{ephemeris.ephemerisSeconds} [ES]</span>
                                <span><>{ephemeris.tde} (TDE)</></span>
                            </TableCell>
                            <TableCell align="right">
                                <AstroCoords coords={ephemeris.coords} />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
