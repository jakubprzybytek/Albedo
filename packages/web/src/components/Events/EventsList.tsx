import type { JSX } from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Angle from '@/common/Angle';
import BodyChip from '@/common/BodyChip';
import { EventType, type Event } from './EventsBrowser';
import type { Conjunction } from '@/sdk/Conjunctions';
import type { Eclipse } from '@/sdk/Eclipses';
import { EclipseType } from '@/sdk/Eclipses';

type ConjunctionEventParamType = {
  conjunction: Conjunction;
}

function ConjunctionEvent({ conjunction }: ConjunctionEventParamType): JSX.Element {
  return (
    <>
      <Typography variant="subtitle2" sx={{ padding: 1 }}>
        <>{new Date(conjunction.tde).toLocaleString('pl-pl')}</>
      </Typography>
      <Typography sx={{ pb: 1, pr: 1, pl: 1 }}>
        <>Conjunction between <BodyChip body={conjunction.firstBody.info} /> and <BodyChip body={conjunction.secondBody.info} /> with a sepration of <Angle value={conjunction.separation} />.</>
      </Typography>
    </>
  );
}

type EclipseEventParamType = {
  eclipse: Eclipse;
}

function EclipseEvent({ eclipse }: EclipseEventParamType): JSX.Element {
  return (
    <>
      <Typography variant="subtitle2" sx={{ padding: 1 }}>
        <>{new Date(eclipse.tde).toLocaleString('pl-pl')}</>
      </Typography>
      <Typography sx={{ pb: 1, pr: 1, pl: 1 }}>
        {eclipse.type == EclipseType.SunEclipse ? 'Sun' : 'Moon'} eclipse with a sepration of <Angle value={eclipse.separation} />.
      </Typography>
    </>
  );
}

type DispatchEventParamType = {
  type: EventType,
  event: Conjunction | Eclipse
}

function DisplayEvent({ type, event }: DispatchEventParamType) {
  switch (type) {
    case EventType.Conjuction:
      return (
        <ConjunctionEvent conjunction={event as Conjunction} />
      );
    case EventType.Eclipse:
      return (
        <EclipseEvent eclipse={event as Eclipse} />
      );
  }
}

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
