import { useTheme } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { RectangularCoordinates } from "@math";
import { StateWithPositionAndVelocity } from '@lambda/states';

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
    states: StateWithPositionAndVelocity[];
}

export default function StatesTable({ states }: StatesTablePropsType): JSX.Element {
    const theme = useTheme();

    console.log('Render');

    return (
        <TableContainer component={Paper} sx={{
            backgroundColor: theme.palette.secondaryBackground,
            '& td, & th': { borderColor: theme.palette.background.default }
        }}>
            <Table size="small" aria-label="a dense table">
                <TableHead>
                    <TableRow>
                        <TableCell>Time</TableCell>
                        <TableCell align="center">Position</TableCell>
                        <TableCell align="right">Velocity</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {states.map((state) => (
                        <TableRow key={state.jde} sx={{
                            '&:last-child td, &:last-child th': { border: 0 },
                            '& span': { display: 'block' }
                        }}>
                            <TableCell>
                                <span>{state.jde} (JDE)</span>
                                <span>{state.ephemerisSeconds} [ES]</span>
                                <span><>{state.tde} (TDE)</></span>
                            </TableCell>
                            <TableCell align="right">
                                <VectorDisplay coords={state.position} />
                            </TableCell>
                            <TableCell align="right">
                                <VectorDisplay coords={state.velocity} />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
