import type { JSX } from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import { type Event } from './EventsBrowser';
import DisplayEvent from './event/DisplayEvent';

type EventsListPropsType = {
  events: Event[];
}

export default function EventsList({ events }: EventsListPropsType): JSX.Element {
  const theme = useTheme();

  return (
    <Box>
      {events.map(event => (
        <Paper key={event.jde} sx={{ marginBottom: 1, backgroundColor: theme.palette.grey[200] }}>
          <DisplayEvent type={event.type} event={event.data} />
        </Paper>
      ))}
    </Box>
  );
}
