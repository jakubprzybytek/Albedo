import { useState } from "react";
import { GetStatesReturnType } from '@lambda/states/getStates';
import StatesQueryForm from './StatesQueryForm';
import StatesTable from './StatesTable';
import styles from './StatesBrowser.module.css';

export default function StatesBrowser(): JSX.Element {
    const [states, setStates] = useState<GetStatesReturnType>([]);

    return (
        <>
            <div className={styles.section}>
                <StatesQueryForm setStates={setStates} />
            </div>
            <div>
                <StatesTable states={states} />
            </div>
        </>
    );
}