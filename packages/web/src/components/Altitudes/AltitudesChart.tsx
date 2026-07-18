import { useState, type JSX } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { Legend, Line, LineChart, ReferenceArea, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { AltitudesResponse, SolarEventDto } from '@/sdk/Altitudes';
import { ALTITUDE_TARGET_NAMES, type AltitudeTargetName } from './altitudeTypes';

const COLORS: Record<AltitudeTargetName, string> = {
  Moon: '#64748b', Mercury: '#7c3aed', Venus: '#db2777', Mars: '#dc2626',
  Jupiter: '#92400e', Saturn: '#0891b2', Uranus: '#0f766e', Neptune: '#2563eb',
};

type SolarPhase = 'day' | 'civilTwilight' | 'nauticalTwilight' | 'astronomicalTwilight' | 'night';

const PHASE_TRANSITIONS: Record<SolarEventDto['type'], { before: SolarPhase; after: SolarPhase }> = {
  sunrise: { before: 'civilTwilight', after: 'day' },
  sunset: { before: 'day', after: 'civilTwilight' },
  civilDawn: { before: 'nauticalTwilight', after: 'civilTwilight' },
  civilDusk: { before: 'civilTwilight', after: 'nauticalTwilight' },
  nauticalDawn: { before: 'astronomicalTwilight', after: 'nauticalTwilight' },
  nauticalDusk: { before: 'nauticalTwilight', after: 'astronomicalTwilight' },
  astronomicalDawn: { before: 'night', after: 'astronomicalTwilight' },
  astronomicalDusk: { before: 'astronomicalTwilight', after: 'night' },
};

const PHASE_COLORS: Record<Exclude<SolarPhase, 'day'>, { fill: string; opacity: number }> = {
  civilTwilight: { fill: '#a16207', opacity: 0.32 },
  nauticalTwilight: { fill: '#34526b', opacity: 0.4 },
  astronomicalTwilight: { fill: '#374151', opacity: 0.48 },
  night: { fill: '#061f32', opacity: 0.7 },
};

type SolarPhaseArea = {
  from: number;
  to: number;
  phase: Exclude<SolarPhase, 'day'>;
};

function solarPhaseAreas(result: AltitudesResponse): SolarPhaseArea[] {
  const from = Date.parse(result.samples[0].tde);
  const to = Date.parse(result.samples.at(-1)!.tde);
  const events = result.solarEvents
    .map(event => ({ ...event, timestamp: Date.parse(event.tde) }))
    .filter(event => event.timestamp >= from && event.timestamp <= to)
    .sort((first, second) => first.timestamp - second.timestamp);
  if (events.length === 0) {
    return [];
  }

  const areas: SolarPhaseArea[] = [];
  let cursor = from;
  let phase = PHASE_TRANSITIONS[events[0].type].before;
  for (const event of events) {
    if (phase !== 'day' && event.timestamp > cursor) {
      areas.push({ from: cursor, to: event.timestamp, phase });
    }
    cursor = event.timestamp;
    phase = PHASE_TRANSITIONS[event.type].after;
  }
  if (phase !== 'day' && cursor < to) {
    areas.push({ from: cursor, to, phase });
  }
  return areas;
}

const utcFormatter = new Intl.DateTimeFormat('pl-PL', {
  timeZone: 'UTC', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
});

function formatUtc(value: number): string {
  return `${utcFormatter.format(new Date(value))} UTC`;
}

type TooltipProps = { active?: boolean; label?: number; payload?: { name: string; value: number; color: string }[] };

function AltitudeTooltip({ active, label, payload }: TooltipProps): JSX.Element | null {
  if (!active || label === undefined || !payload?.length) {
    return null;
  }
  return <Card><CardContent sx={{ py: 1 }}>
    <Typography variant="body2">{formatUtc(label)}</Typography>
    {payload.map(entry => <Typography key={entry.name} variant="body2" color={entry.color}>
      {entry.name}: {entry.value.toFixed(2)} deg
    </Typography>)}
  </CardContent></Card>;
}

type AltitudesChartProps = { result: AltitudesResponse };

export default function AltitudesChart({ result }: AltitudesChartProps): JSX.Element {
  const [hiddenSeries, setHiddenSeries] = useState<Set<AltitudeTargetName>>(new Set());
  const targets = ALTITUDE_TARGET_NAMES.filter(target => target in result.samples[0].altitudes);
  const data = result.samples.map(sample => ({ timestamp: Date.parse(sample.tde), ...sample.altitudes }));
  const phaseAreas = solarPhaseAreas(result);

  return <Box aria-label="Altitude chart" sx={{ height: { xs: 420, sm: 520 }, width: '100%', minWidth: 0 }}>
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 28, right: 22, bottom: 22, left: 8 }}>
        <XAxis dataKey="timestamp" type="number" domain={['dataMin', 'dataMax']} tickFormatter={formatUtc} minTickGap={72} />
        <YAxis domain={[0, 90]} allowDataOverflow width={48} unit=" deg" />
        {phaseAreas.map(area => <ReferenceArea key={`${area.phase}-${area.from}`} x1={area.from} x2={area.to}
          fill={PHASE_COLORS[area.phase].fill} fillOpacity={PHASE_COLORS[area.phase].opacity} strokeOpacity={0} />)}
        <Tooltip content={<AltitudeTooltip />} />
        <Legend wrapperStyle={{ cursor: 'pointer' }} onClick={item => {
          const target = item.dataKey as AltitudeTargetName;
          setHiddenSeries(previous => {
            const next = new Set(previous);
            next.has(target) ? next.delete(target) : next.add(target);
            return next;
          });
        }} />
        <ReferenceLine y={0} stroke="#374151" label="Horizon" />
        {targets.map(target => <Line key={target} type="monotone" name={target} dataKey={target} stroke={COLORS[target]}
          dot={false} strokeWidth={2} hide={hiddenSeries.has(target)} isAnimationActive={false} />)}
      </LineChart>
    </ResponsiveContainer>
  </Box>;
}