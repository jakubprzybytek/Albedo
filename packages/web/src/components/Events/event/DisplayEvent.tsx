import { useState } from 'react';
import IconButton from '@mui/material/IconButton';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { EventType } from '../EventsBrowser';
import type { Conjunction } from '@/sdk/Conjunctions';
import type { Eclipse } from '@/sdk/Eclipses';
import ConjunctionEvent from './ConjunctionEvent';
import EclipseEvent from './EclipseEvent';

type DispatchEventParamType = {
  type: EventType,
  event: Conjunction | Eclipse
}

export default function DisplayEvent({ type, event }: DispatchEventParamType) {
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      <IconButton size="small" sx={{ position: 'absolute', right: '8px' }} onClick={() => setExpanded(!expanded)}>
        {expanded ? <ExpandLess /> : <ExpandMore />}
      </IconButton>
      {type === EventType.Conjuction && (
        <ConjunctionEvent conjunction={event as Conjunction} expanded={expanded} />
      )}
      {type === EventType.Eclipse && (
        <EclipseEvent eclipse={event as Eclipse} expanded={expanded} />
      )}
    </>
  );
}
