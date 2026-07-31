import type { AltitudeTargetName, SolarEventType } from '@/components/Altitudes/altitudeTypes';

export type SolarPhase = 'day' | 'civilTwilight' | 'nauticalTwilight' | 'astronomicalTwilight' | 'night';

export const OBJECT_COLORS: Record<AltitudeTargetName, string> = {
  Moon: '#94a3b8', Mercury: '#a78bfa', Venus: '#f472b6', Mars: '#f87171',
  Jupiter: '#fb923c', Saturn: '#22d3ee', Uranus: '#34d399', Neptune: '#818cf8',
};

export const SOLAR_PHASE_COLORS: Record<SolarPhase, string> = {
  day: '#fef3c7', civilTwilight: '#d6a242', nauticalTwilight: '#56748c', astronomicalTwilight: '#58616d', night: '#102f46',
};

export const PHASE_TRANSITIONS: Record<SolarEventType, { before: SolarPhase; after: SolarPhase }> = {
  sunrise: { before: 'civilTwilight', after: 'day' }, sunset: { before: 'day', after: 'civilTwilight' },
  civilDawn: { before: 'nauticalTwilight', after: 'civilTwilight' }, civilDusk: { before: 'civilTwilight', after: 'nauticalTwilight' },
  nauticalDawn: { before: 'astronomicalTwilight', after: 'nauticalTwilight' }, nauticalDusk: { before: 'nauticalTwilight', after: 'astronomicalTwilight' },
  astronomicalDawn: { before: 'night', after: 'astronomicalTwilight' }, astronomicalDusk: { before: 'astronomicalTwilight', after: 'night' },
};