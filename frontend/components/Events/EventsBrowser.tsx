import { useState } from "react";
import Box from '@mui/material/Box';
import EventsQueryForm from './EventsQueryForm';
import EventsList from './EventsList';

export default function EventsBrowser(): JSX.Element {
    const [events, setEvents] = useState<any[]>([]);

    return (
        <>
            <EventsQueryForm setEvents={setEvents} />
            <EventsList events={events} />
        </>
    );
}