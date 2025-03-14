import { useState } from "react";
import Box from "@mui/material/Box";
import EclipsesQueryForm from './EclipsesQueryForm';
import EclipsesTable from './EclipsesTable';
import { Eclipse } from '@lambda/eclipses';

export default function EclipsesBrowser(): JSX.Element {
    const [eclipses, setEclipses] = useState<Eclipse[]>([]);

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
            <EclipsesQueryForm setEclipses={setEclipses} />
            <EclipsesTable eclipses={eclipses} />
        </Box>
    );
}