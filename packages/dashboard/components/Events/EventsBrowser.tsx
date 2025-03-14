import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";
import EventsList from './EventsList';
import getConjunctions from "../../sdk/GetConjunctions";

export default function EventsBrowser(): JSX.Element {
    const [events, setEvents] = useState<any[]>([]);

    const progress = events.length > 0 ? 100 : 0;

    useEffect(() => {
        const fetchData = async () => {
            const conjunctions = await getConjunctions();
            setEvents(conjunctions);
        };

        fetchData();
    }, []);

    return (
        <>
            <LinearProgress variant="determinate" value={progress} />
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
                <EventsList events={events} />
            </Box>
        </>
    );
}