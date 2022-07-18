import { useState } from "react";
import Box from '@mui/material/Box';
import ConjunctionsQueryForm from './ConjunctionsQueryForm';
import ConjunctionsTable from './ConjunctionsTable';
import { Conjunction } from '@lambda/conjunctions';

export default function StatesBrowser(): JSX.Element {
    const [conjunctions, setConjunctions] = useState<Conjunction[]>([]);

    return (
        <Box sx={{ '& > div': { mb: 1 } }}>
            <div>
                <ConjunctionsQueryForm setConjunctions={setConjunctions} />
            </div>
            <div>
                <ConjunctionsTable conjunctions={conjunctions} />
            </div>
        </Box>
    );
}