import type { JSX } from 'react';
import { useTheme } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import Skeleton from '@mui/material/Skeleton';
import { type Event } from './EventsBrowser';
import DisplayEvent from './event/DisplayEvent';

type EventsListPropsType = {
  events: Event[];
}

export default function EventsList({ events }: EventsListPropsType): JSX.Element {
  const theme = useTheme();

  if (events.length === 0) {
    return (
      <Stack paddingTop={1} paddingLeft={{ md: 1 }} paddingRight={{md: 1 }} spacing={1}>
        <Skeleton variant="rounded" animation="wave" width="100%" height={102} />
        <Skeleton variant="rounded" animation="wave" width="100%" height={102} />
        <Skeleton variant="rounded" animation="wave" width="100%" height={102} />
        <Skeleton variant="rounded" animation="wave" width="100%" height={102} />
        <Skeleton variant="rounded" animation="wave" width="100%" height={102} />
      </Stack>
    );
  }

  return (
    <Stack paddingTop={1} paddingLeft={{ md: 1 }} paddingRight={{ md: 1 }} spacing={1}>
      {events.map(event => (
        <Paper key={event.jde} className='event' variant='outlined' sx={{ padding: 1, backgroundColor: theme.palette.grey[200] }}>
          <DisplayEvent type={event.type} event={event.data} />
        </Paper>
      ))}
    </Stack>
  );
}
