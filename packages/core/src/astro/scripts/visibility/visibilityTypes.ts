import type { AltitudeTargetName, SolarEventAtEphemerisSecond, SolarPhase } from '../altitudes';

export type VisibilityInterval = {
  key: string;
  fromEs: number;
  toEs: number;
};

export type TimedObjectEvent = {
  es: number;
};

export type TransitEvent = TimedObjectEvent & {
  altitude: number;
};

export type ObjectEvents = {
  rise: TimedObjectEvent | null;
  transit: TransitEvent | null;
  set: TimedObjectEvent | null;
};

export type VisibilityIntervalResult = {
  key: string;
  objects: Partial<Record<AltitudeTargetName, ObjectEvents>>;
  solar: {
    phaseAtStart: SolarPhase;
    events: SolarEventAtEphemerisSecond[];
  };
};