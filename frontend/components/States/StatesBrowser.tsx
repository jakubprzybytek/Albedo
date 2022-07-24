import { useState } from "react";
import StatesQueryForm from './StatesQueryForm';
import StatesTable from './StatesTable';
import { StateWithPositionAndVelocity } from '@lambda/states';

export default function StatesBrowser(): JSX.Element {
    const [states, setStates] = useState<StateWithPositionAndVelocity[]>([]);

    return (
        <>
            <StatesQueryForm setStates={setStates} />
            <StatesTable states={states} />
        </>
    );
}