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
