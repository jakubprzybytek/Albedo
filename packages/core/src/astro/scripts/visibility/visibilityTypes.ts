import type { AltitudeTargetName, SolarEventAtEphemerisSecond, SolarPhase } from '../altitudes';

export type RiseSetEvent = {
  type: 'rise' | 'set';
  es: number;
};

export type TransitEvent = {
  type: 'transit';
  es: number;
  altitude: number;
};

export type ObjectEvent = RiseSetEvent | TransitEvent;

export type SolarPhaseAtTime = {
  es: number;
  phase: SolarPhase;
};

export type VisibilityResult = {
  objects: Partial<Record<AltitudeTargetName, ObjectEvent[]>>;
  solar: {
    events: SolarEventAtEphemerisSecond[];
    phases: SolarPhaseAtTime[];
  };
};