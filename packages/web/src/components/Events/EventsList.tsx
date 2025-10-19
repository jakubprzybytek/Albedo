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
      <Stack spacing={1}>
        <Skeleton variant="rounded" animation="wave" width="100%" height={70} />
        <Skeleton variant="rounded" animation="wave" width="100%" height={70} />
        <Skeleton variant="rounded" animation="wave" width="100%" height={70} />
      </Stack>
    );
  }

  return (
    <Stack paddingLeft={0.25} paddingRight={0.25} spacing={1}>
      {events.map(event => (
        <Paper key={event.jde} className='event' variant='outlined' sx={{ padding: 1, backgroundColor: theme.palette.grey[200] }}>
          <DisplayEvent type={event.type} event={event.data} />
        </Paper>
      ))}
    </Stack>
  );
}
