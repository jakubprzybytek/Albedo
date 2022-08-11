import { useEffect, useState } from "react";
import EventsList from './EventsList';
import getConjunctions from "../../sdk/GetConjunctions";

export default function EventsBrowser(): JSX.Element {
    const [events, setEvents] = useState<any[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            const conjunctions = await getConjunctions();
            setEvents(conjunctions);
        };

        fetchData();
    }, []);

    return (
        <EventsList events={events} />
    );
}