import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Conjunction } from '@lambda/conjunctions';
import { formatDegrees } from '../../utils';
import AstronomicalCoords from 'common/AstronomicalCoordinates';
import BodyChip from 'common/BodyChip';

type ConjunctionsTablePropsType = {
    conjunctions: Conjunction[];
}

export default function ConjunctionsTable({ conjunctions }: ConjunctionsTablePropsType): JSX.Element {
    const theme = useTheme();

    return (
        <TableContainer component={Paper} sx={{
            width: 'auto',
            backgroundColor: theme.palette.secondaryBackground,
            '& td, & th': { borderColor: theme.palette.background.default }
        }}>
            <Table size="small">
                <TableHead>
                    <TableRow>
                        <TableCell>Time</TableCell>
                        <TableCell align="center">Event</TableCell>
                        <TableCell align="center">First body</TableCell>
                        <TableCell align="center">Second body</TableCell>
                        <TableCell align="right">Separation</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {conjunctions.map((conjunction) => (
                        <TableRow key={`${conjunction.jde}-${conjunction.firstBody.info.id}-${conjunction.secondBody.info.id}`} sx={{
                            '&:last-child td, &:last-child th': { border: 0 }
                        }}>
                            <TableCell>
                                <span>{conjunction.jde} (JDE)</span>
                                <span><>{conjunction.tde} (TDE)</></span>
                            </TableCell>
                            <TableCell>
                                <Typography>
                                    Conjunction between <BodyChip body={conjunction.firstBody.info} /> and <BodyChip body={conjunction.secondBody.info} /> with a sepration of {formatDegrees(conjunction.separation)}.
                                </Typography>
                            </TableCell>
                            <TableCell align="center">
                                {conjunction.firstBody.info.name}
                                <AstronomicalCoords coords={conjunction.firstBody.ephemeris.coords} />
                            </TableCell>
                            <TableCell align="center">
                                {conjunction.secondBody.info.name}
                                <AstronomicalCoords coords={conjunction.secondBody.ephemeris.coords} />
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
