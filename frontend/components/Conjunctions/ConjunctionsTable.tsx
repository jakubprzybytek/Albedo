import { useTheme } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { AstronomicalCoordinates } from "@math";
import { Conjunction } from '@lambda/conjunctions';
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

type ConjunctionsTablePropsType = {
    conjunctions: Conjunction[];
}

export default function ConjunctionsTable({ conjunctions }: ConjunctionsTablePropsType): JSX.Element {
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
                    {conjunctions.map((conjunction) => (
                        <TableRow key={conjunction.jde} sx={{
                            '&:last-child td, &:last-child th': { border: 0 },
                            '& span': { display: 'block' }
                        }}>
                            <TableCell>
                                <span>{conjunction.jde} (JDE)</span>
                                <span><>{conjunction.tde} (TDE)</></span>
                            </TableCell>
                            <TableCell align="center">
                                ({conjunction.firstBody.id})
                                <AstroCoords coords={conjunction.firstBody.ephemeris.coords} />
                            </TableCell>
                            <TableCell align="center">
                                ({conjunction.secondBody.id})
                                <AstroCoords coords={conjunction.secondBody.ephemeris.coords} />
                            </TableCell>
                            <TableCell align="right">
                                {formatDegrees(conjunction.separation)}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
