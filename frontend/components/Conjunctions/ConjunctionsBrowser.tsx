import { useState } from "react";
import ConjunctionsQueryForm from './ConjunctionsQueryForm';
import ConjunctionsTable from './ConjunctionsTable';
import { Conjunction } from '@lambda/conjunctions';

export default function ConjunctionsBrowser(): JSX.Element {
    const [conjunctions, setConjunctions] = useState<Conjunction[]>([]);

    return (
        <>
            <ConjunctionsQueryForm setConjunctions={setConjunctions} />
            <ConjunctionsTable conjunctions={conjunctions} />
        </>
    );
}