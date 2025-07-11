import type { JSX } from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import { type Event } from './EventsBrowser';
import DisplayEvent from './event/DisplayEvent';
import { Skeleton, Stack } from '@mui/material';

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
    <Box>
      {events.map(event => (
        <Paper key={event.jde} sx={{ marginBottom: 1, backgroundColor: theme.palette.grey[200] }}>
          <DisplayEvent type={event.type} event={event.data} />
        </Paper>
      ))}
    </Box>
  );
}
