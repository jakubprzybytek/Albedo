import { useState } from "react";
import EphemerisQueryForm from './EphemerisQueryForm';
import EphemerisTable from './EphemerisTable';
import { Ephemeris } from '@lambda/ephemeris';

export default function StatesBrowser(): JSX.Element {
    const [ephemerides, setEphemerides] = useState<Ephemeris[]>([]);

    return (
        <>
            <EphemerisQueryForm setEphemerides={setEphemerides} />
            <EphemerisTable ephemerides={ephemerides} />
        </>
    );
}