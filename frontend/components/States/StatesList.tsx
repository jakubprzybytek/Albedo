import { useState, useEffect } from "react";
import { GetStatesReturnType } from '@lambda/states/getStates';
import { RectangularCoordinates } from "@math";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import styles from "./StatesList.module.css";

type VectoryDisplayPropsType = {
    coords: RectangularCoordinates;
}

function VectorDisplay({ coords }: VectoryDisplayPropsType): JSX.Element {
    return (
        <span>x: {coords.x}, y: {coords.y}, z: {coords.z}</span>
    );
}

export default function StatesList(): JSX.Element {
    const [states, setStates] = useState<GetStatesReturnType>([]);

    console.log('Render');

    useEffect(() => {
        console.log('Start fetch');

        fetch(process.env.NEXT_PUBLIC_API_URL + "/api/states?target=Sun&observer=Solar%20System%20Barycenter&fromTde=2019-10-09&toTde=2019-10-10&interval=0.2")
            .then((response) => response.json())
            .then((data) => {
                console.log('Fetched: ' + data);
                setStates(data);
            });
    }, []);

    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
                <TableHead>
                    <TableRow>
                        <TableCell>JDE</TableCell>
                        <TableCell align="center">ES</TableCell>
                        <TableCell align="center">Position</TableCell>
                        <TableCell align="right">Velocity</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {states.map((state) => (
                        <TableRow key={state.jde}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell className={styles.paragraph}>{state.jde}</TableCell>
                            <TableCell>{state.ephemerisSeconds}</TableCell>
                            <TableCell align="right"><VectorDisplay coords={state.position} /></TableCell>
                            <TableCell align="right"><VectorDisplay coords={state.velocity} /></TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
