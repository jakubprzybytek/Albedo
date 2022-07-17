import { useTheme } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { AstronomicalCoordinates } from "@math";
import { Separation } from '@lambda/separations';
import { formatHourAngle, formatDegrees } from '../Utils';


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
type SeparationsTablePropsType = {
    separations: Separation[];
}

export default function SeparationsTable({ separations }: SeparationsTablePropsType): JSX.Element {
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
                        <TableCell align="center">First body</TableCell>
                        <TableCell align="center">Second body</TableCell>
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
                                <span>{separation.ephemerisSeconds} [ES]</span>
                                <span><>{separation.tde} (TDE)</></span>
                            </TableCell>
                            <TableCell align="center">
                                <AstroCoords coords={separation.firstBody.ephemeris.coords} />
                            </TableCell>
                            <TableCell align="center">
                                <AstroCoords coords={separation.secondBody.ephemeris.coords} />
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
