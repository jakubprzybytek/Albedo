import { useState } from "react";
import Box from "@mui/material/Box";
import StatesQueryForm from './StatesQueryForm';
import StatesTable from './StatesTable';
import { StateWithPositionAndVelocity } from '@lambda/states';

export default function StatesBrowser(): JSX.Element {
    const [states, setStates] = useState<StateWithPositionAndVelocity[]>([]);

    return (
        <Box sx={{
            '& > *': {
                marginTop: 1,
                marginRight: {
                    md: 1
                },
                marginLeft: {
                    md: 1
                },
            }
        }}>
            <StatesQueryForm setStates={setStates} />
            <StatesTable states={states} />
        </Box>
    );
}