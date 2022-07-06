import { useState } from "react";
import { GetStatesReturnType } from '@lambda/states/getStates';
import Box from '@mui/material/Box';
import StatesQueryForm from './StatesQueryForm';
import StatesTable from './StatesTable';

export default function StatesBrowser(): JSX.Element {
    const [states, setStates] = useState<GetStatesReturnType>([]);

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