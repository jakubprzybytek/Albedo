import { useState } from "react";
import Box from "@mui/material/Box";
import EphemerisQueryForm from './EphemerisQueryForm';
import EphemerisTable from './EphemerisTable';
import { Ephemeris } from '@lambda/ephemeris';

export default function StatesBrowser(): JSX.Element {
    const [ephemerides, setEphemerides] = useState<Ephemeris[]>([]);

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
            <EphemerisQueryForm setEphemerides={setEphemerides} />
            <EphemerisTable ephemerides={ephemerides} />
        </Box>
    );
}