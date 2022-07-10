import { useState } from "react";
import Box from '@mui/material/Box';
import EphemerisQueryForm from './EphemerisQueryForm';
import EphemerisTable from './EphemerisTable';
import { Ephemeris } from '@lambda/ephemeris';

export default function StatesBrowser(): JSX.Element {
    const [ephemerides, setEphemerides] = useState<Ephemeris[]>([]);

    return (
        <Box sx={{ '& > div': { mb: 1 } }}>
            <div>
                <EphemerisQueryForm setEphemerides={setEphemerides} />
            </div>
            <div>
                <EphemerisTable ephemerides={ephemerides} />
            </div>
        </Box>
    );
}