import type { AltitudeTargetName, SolarEventType } from '@/components/Altitudes/altitudeTypes';

export type SolarPhase = 'day' | 'civilTwilight' | 'nauticalTwilight' | 'astronomicalTwilight' | 'night';

export const OBJECT_COLORS: Record<AltitudeTargetName, string> = {
  Moon: '#64748b', Mercury: '#7c3aed', Venus: '#db2777', Mars: '#dc2626',
  Jupiter: '#92400e', Saturn: '#0891b2', Uranus: '#0f766e', Neptune: '#2563eb',
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