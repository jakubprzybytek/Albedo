import { useState } from "react";
import Box from '@mui/material/Box';
import EventsQueryForm from './EventsQueryForm';
import EventsList from './EventsList';

export default function EventsBrowser(): JSX.Element {
    const [events, setEvents] = useState<any[]>([]);

    return (
        <Box sx={{ '& > div': { mb: 1 } }}>
            <div>
                <EventsQueryForm setEvents={setEvents} />
            </div>
            <div>
                <EventsList events={events} />
            </div>
        </Box>
    );
}