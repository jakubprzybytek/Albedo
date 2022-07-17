import { useState } from "react";
import Box from '@mui/material/Box';
import SeparationsQueryForm from './SeparationsQueryForm';
import SeparationsTable from './SeparationsTable';
import { Separation } from '@lambda/separations';

export default function SeparationsBrowser(): JSX.Element {
    const [separations, setSeparations] = useState<Separation[]>([]);

    return (
        <Box sx={{ '& > div': { mb: 1 } }}>
            <div>
                <SeparationsQueryForm setSeparations={setSeparations} />
            </div>
            <div>
                <SeparationsTable separations={separations} />
            </div>
        </Box>
    );
}