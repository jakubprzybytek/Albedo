import { GetStatesReturnType } from '@lambda/states/getStates';
import { RectangularCoordinates } from "@math";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

type VectoryDisplayPropsType = {
    coords: RectangularCoordinates;
}

function VectorDisplay({ coords }: VectoryDisplayPropsType): JSX.Element {
    return (
        <>
            <span>x: {coords.x}</span>
            <span>y: {coords.y}</span>
            <span>z: {coords.z}</span>
        </>
    );
}

type StatesListPropsType = {
    states: GetStatesReturnType;
}

export default function StatesList({ states }: StatesListPropsType): JSX.Element {

    console.log('Render');

    return (
        <TableContainer component={Paper}>
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
                                <span>{state.jde} [JDE]</span>
                                <span>{state.ephemerisSeconds} [ES]</span>
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
