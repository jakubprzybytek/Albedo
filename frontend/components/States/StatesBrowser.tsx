import { useState } from "react";
import { GetStatesReturnType } from '@lambda/states/getStates';
import StatesQueryForm from './StatesQueryForm';
import StatesTable from './StatesTable';

export default function StatesBrowser(): JSX.Element {
    const [states, setStates] = useState<GetStatesReturnType>([]);

    return (
        <div>
            <StatesQueryForm setStates={setStates} />
            <StatesTable states={states} />
        </div>
    );
}