import { useState } from "react";
import Box from "@mui/material/Box";
import ConjunctionsQueryForm from './ConjunctionsQueryForm';
import ConjunctionsTable from './ConjunctionsTable';
import { Conjunction } from '@lambda/conjunctions';

export default function ConjunctionsBrowser(): JSX.Element {
    const [conjunctions, setConjunctions] = useState<Conjunction[]>([]);

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
            <ConjunctionsQueryForm setConjunctions={setConjunctions} />
            <ConjunctionsTable conjunctions={conjunctions} />
        </Box>
    );
}