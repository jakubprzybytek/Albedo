import { useEffect, useMemo, useState, type JSX } from "react";
import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";
import { addMonths, format } from 'date-fns';
import EventsList from './EventsList';
import getConjunctions, { type Conjunction, type ConjunctionsQuery } from "@/sdk/Conjunctions";
import type { Eclipse, EclipsesQuery } from "@/sdk/Eclipses";
import getEclipses from "@/sdk/Eclipses";

export enum EventType {
  Conjuction,
  Eclipse
}

export type Event = {
  jde: number,
  type: EventType,
  data: any
}

export default function EventsBrowser(): JSX.Element {
  const [conjunctions, setConjunctions] = useState<Conjunction[]>([]);
  const [eclipses, setEclipses] = useState<Eclipse[]>([]);

  const events = useMemo(() => {
    return [
      ...toEvents(conjunctions, EventType.Conjuction),
      ...toEvents(eclipses, EventType.Eclipse)
    ]
      .sort((a, b) => a.jde - b.jde);
  }, [conjunctions, eclipses]);

  const progress = events.length > 0 ? 100 : 0;

  function toEvents(rawEvents: any[], type: EventType): Event[] {
    return rawEvents.map<Event>(event => ({
      jde: event.jde,
      type,
      data: event
    }));
  }

  useEffect(() => {
    const fetchEData = async () => {
      const query: EclipsesQuery = {
        fromTde: format(new Date(), 'yyyy-MM-dd'),
        toTde: format(addMonths(new Date(), 12), 'yyyy-MM-dd'),
      };
      const eclipses = await getEclipses(query);
      setEclipses(eclipses);
    };

    fetchEData();
  }, []);

  useEffect(() => {
    const fetchCData = async () => {
      const query: ConjunctionsQuery = {
        fromTde: format(new Date(), 'yyyy-MM-dd'),
        toTde: format(addMonths(new Date(), 6), 'yyyy-MM-dd'),
      };
      const conjunctions = await getConjunctions(query);
      setConjunctions(conjunctions);
    };

    fetchCData();
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