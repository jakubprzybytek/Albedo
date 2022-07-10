import { useState } from "react";
import Box from '@mui/material/Box';
import StatesQueryForm from './StatesQueryForm';
import StatesTable from './StatesTable';
import { State } from '@lambda/states';

export default function StatesBrowser(): JSX.Element {
    const [states, setStates] = useState<State[]>([]);

    return (
        <Box sx={{ '& > div': { mb: 1 } }}>
            <div>
                <StatesQueryForm setStates={setStates} />
            </div>
            <div>
                <StatesTable states={states} />
            </div>
        </Box>
    );
}