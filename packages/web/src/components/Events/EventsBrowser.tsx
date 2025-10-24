import { useEffect, useMemo, useState, type JSX } from "react";
import LinearProgress from "@mui/material/LinearProgress";
import { addMonths, format } from 'date-fns';
import EventsList from './EventsList';
import getConjunctions, { type Conjunction, type ConjunctionsQuery } from "@/sdk/Conjunctions";
import type { Eclipse, EclipsesQuery } from "@/sdk/Eclipses";
import { useProfile } from "@/components/Profile/useProfile";
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

function toEvents(rawEvents: any[], type: EventType): Event[] {
  return rawEvents.map<Event>(event => ({
    jde: event.jde,
    type,
    data: event
  }));
}

export default function EventsBrowser(): JSX.Element {
  const [conjunctions, setConjunctions] = useState<Conjunction[]>([]);
  const [eclipses, setEclipses] = useState<Eclipse[]>([]);

  const [eventTypesLoaded, setEventTypesLoaded] = useState(0);

  const [profile] = useProfile();

  const events = useMemo(() => {
    return [
      ...toEvents(conjunctions, EventType.Conjuction),
      ...toEvents(eclipses, EventType.Eclipse)
    ]
      .sort((a, b) => a.jde - b.jde);
  }, [conjunctions, eclipses]);

  const progress = (eventTypesLoaded / 2.0) * 100.0;

  useEffect(() => {
    const fetchEData = async () => {
      const query: EclipsesQuery = {
        fromTde: format(new Date(), 'yyyy-MM-dd'),
        toTde: format(addMonths(new Date(), 12), 'yyyy-MM-dd'),
        location: profile.location
      };
      const eclipses = await getEclipses(query);
      setEclipses(eclipses);
      setEventTypesLoaded(previous => previous + 1);
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
      setEventTypesLoaded(previous => previous + 1);
    };

    fetchCData();
  }, []);

  return (
    <>
      <LinearProgress variant="determinate" value={progress} />
      <EventsList events={events} />
    </>
  );
}