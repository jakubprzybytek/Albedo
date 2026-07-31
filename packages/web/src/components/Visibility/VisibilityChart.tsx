import { memo, useEffect, useMemo, useRef, useState, type JSX } from 'react';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { OBJECT_COLORS, PHASE_TRANSITIONS, SOLAR_PHASE_COLORS, type SolarPhase } from '@/common/charts/astronomyChartConfig';
import type { VisibilityDayDto, VisibilityEventDto } from '@/sdk/Visibility';
import { ALTITUDE_TARGET_NAMES, type AltitudeTargetName } from '@/components/Altitudes/altitudeTypes';

type Props = { days: VisibilityDayDto[]; timeZone: string };
const plotLeft = 100;
const plotWidth = 960;
const chartWidth = plotLeft + plotWidth + 24;
const axisHeight = 26;
const NOON = 720;

type EventKind = 'rise' | 'transit' | 'set';

const EVENT_STYLES: Record<EventKind, { dash?: string; label: string }> = {
  rise: { dash: '8 5', label: 'Rise' },
  transit: { label: 'Highest altitude' },
  set: { dash: '2 5', label: 'Set' },
};

function observingMinute(minuteOfDay: number): number {
  return minuteOfDay >= NOON ? minuteOfDay - NOON : minuteOfDay + NOON;
}

function observingWindow(days: VisibilityDayDto[]): { from: number; to: number } {
  const sunsets = days.flatMap(day => day.solar.events.filter(event => event.type === 'sunset').map(event => observingMinute(event.minuteOfDay)));
  const sunrises = days.flatMap(day => day.solar.events.filter(event => event.type === 'sunrise').map(event => observingMinute(event.minuteOfDay)));
  if (!sunsets.length || !sunrises.length) return { from: 0, to: 1440 };

  return {
    from: Math.max(0, Math.floor((sunsets.reduce((minimum, minute) => Math.min(minimum, minute)) - 60) / 60) * 60),
    to: Math.min(1440, Math.ceil((sunrises.reduce((maximum, minute) => Math.max(maximum, minute)) + 60) / 60) * 60),
  };
}

function phaseAtMinute(day: VisibilityDayDto, minute: number): SolarPhase {
  let phase = day.solar.phaseAtStart;
  for (const event of [...day.solar.events].sort((first, second) => first.minuteOfDay - second.minuteOfDay)) {
    if (event.minuteOfDay > minute) break;
    phase = PHASE_TRANSITIONS[event.type].after;
  }
  return phase;
}

function observingPhaseIntervals(day: VisibilityDayDto, followingDay: VisibilityDayDto | undefined) {
  let phase = phaseAtMinute(day, NOON);
  let from = 0;
  const events = [
    ...day.solar.events.filter(event => event.minuteOfDay >= NOON).map(event => ({ ...event, observingMinute: event.minuteOfDay - NOON })),
    ...(followingDay?.solar.events ?? []).filter(event => event.minuteOfDay < NOON).map(event => ({ ...event, observingMinute: event.minuteOfDay + NOON })),
  ].sort((first, second) => first.observingMinute - second.observingMinute);

  return events.flatMap(event => {
    const interval = { from, to: event.observingMinute, phase };
    from = event.observingMinute;
    phase = PHASE_TRANSITIONS[event.type].after;
    return interval.to > interval.from ? [interval] : [];
  }).concat([{ from, to: 1440, phase }]).filter(interval => interval.to > interval.from);
}

type PhaseInterval = ReturnType<typeof observingPhaseIntervals>[number];
type PhaseBandPoint = PhaseInterval & { rowIndex: number };

const PHASE_DEPTH: Record<SolarPhase, number> = {
  day: 0,
  civilTwilight: 1,
  nauticalTwilight: 2,
  astronomicalTwilight: 3,
  night: 4,
};

function intervalsAtLeastAsDark(intervals: PhaseInterval[], phase: SolarPhase): PhaseInterval[] {
  const selected = intervals.filter(interval => PHASE_DEPTH[interval.phase] >= PHASE_DEPTH[phase]);
  return selected.reduce<PhaseInterval[]>((merged, interval) => {
    const previous = merged.at(-1);
    if (previous?.to === interval.from) {
      previous.to = interval.to;
    } else {
      merged.push({ ...interval, phase });
    }
    return merged;
  }, []);
}

function solarPhasePolygons(days: VisibilityDayDto[]): { phase: SolarPhase; points: PhaseBandPoint[] }[] {
  const intervalsByRow = days.map((day, rowIndex) => ({
    rowIndex, intervals: observingPhaseIntervals(day, days[rowIndex + 1]),
  }));
  const phases = (Object.keys(SOLAR_PHASE_COLORS) as SolarPhase[]).filter(phase => phase !== 'day');
  const polygons: { phase: SolarPhase; points: PhaseBandPoint[] }[] = [];

  for (const phase of phases) {
    const rows = intervalsByRow.map(row => ({
      rowIndex: row.rowIndex,
      intervals: intervalsAtLeastAsDark(row.intervals, phase),
    }));
    const slotCount = Math.max(0, ...rows.map(row => row.intervals.filter(interval => interval.phase === phase).length));
    for (let slot = 0; slot < slotCount; slot += 1) {
      let current: PhaseBandPoint[] = [];
      for (const row of rows) {
        const interval = row.intervals.filter(candidate => candidate.phase === phase)[slot];
        if (interval) {
          current.push({ ...interval, rowIndex: row.rowIndex });
        } else if (current.length) {
          polygons.push({ phase, points: current });
          current = [];
        }
      }
      if (current.length) polygons.push({ phase, points: current });
    }
  }

  return polygons;
}

function isFirstAvailableDayOfMonth(date: string, previousDate: string | undefined): boolean {
  return !previousDate || date.slice(0, 7) !== previousDate.slice(0, 7);
}

function trackPoints(days: VisibilityDayDto[], target: AltitudeTargetName, kind: EventKind) {
  return days.flatMap((day, dayIndex) => {
    const event = day.objects[target]?.[kind];
    if (!event) return [];
    const rowIndex = event.minuteOfDay < NOON ? dayIndex - 1 : dayIndex;
    return rowIndex >= 0 && rowIndex < days.length
      ? [{ dayIndex, rowIndex, minute: observingMinute(event.minuteOfDay), event }]
      : [];
  });
}

function trackSegments(points: ReturnType<typeof trackPoints>): (typeof points)[] {
  const segments: (typeof points)[] = [];
  for (const point of points) {
    const segment = segments.at(-1);
    if (!segment?.length || point.dayIndex !== segment.at(-1)!.dayIndex + 1 || point.rowIndex !== segment.at(-1)!.rowIndex + 1) {
      segments.push([point]);
    } else {
      segment.push(point);
    }
  }
  return segments;
}

function VisibilityChart({ days, timeZone }: Props): JSX.Element {
  const [visibleTargets, setVisibleTargets] = useState(() => new Set<AltitudeTargetName>(ALTITUDE_TARGET_NAMES));
  const [visibleEvents, setVisibleEvents] = useState(new Set(['rise', 'transit', 'set']));
  const availableTargets = useMemo(() => new Set<AltitudeTargetName>(days.flatMap(day => Object.keys(day.objects) as AltitudeTargetName[])), [days]);
  const hasEvents = useMemo(() => days.some(day => Object.values(day.objects).some(events => events?.rise || events?.transit || events?.set)), [days]);
  const phasePolygons = useMemo(() => solarPhasePolygons(days), [days]);
  const window = useMemo(() => observingWindow(days), [days]);
  const tracks = useMemo(() => ALTITUDE_TARGET_NAMES.flatMap(target => (['rise', 'transit', 'set'] as const).map(kind => {
    const points = trackPoints(days, target, kind);
    return { target, kind, points, segments: trackSegments(points) };
  })), [days]);
  const tableTimeFormat = useMemo(() => new Intl.DateTimeFormat(undefined, { hour: '2-digit', minute: '2-digit', timeZone }), [timeZone]);
  const formatObservingTime = (minute: number) => `${String((minute / 60 + 12) % 24).padStart(2, '0')}:00`;
  const rowHeight = Math.min(12, Math.max(3, (chartWidth * 1.5 - axisHeight) / Math.max(days.length, 1)));
  const height = Math.max(120, days.length * rowHeight + axisHeight);
  const containerRef = useRef<HTMLDivElement>(null);
  const [renderedWidth, setRenderedWidth] = useState(chartWidth);
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new ResizeObserver(entries => {
      const width = entries[0]?.contentRect.width;
      if (width > 0) setRenderedWidth(width);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  const scale = chartWidth / renderedWidth;
  const labelFontSize = 11 * scale;
  const trackStrokeWidth = 1.8 * scale;
  const gridStrokeWidthMidnight = 1.5 * scale;
  const gridStrokeWidthHour = scale;
  const x = (minute: number) => plotLeft + (minute - window.from) / (window.to - window.from) * plotWidth;
  const y = (rowIndex: number) => axisHeight + (rowIndex + 0.5) * rowHeight;
  const phasePolygonPoints = (points: PhaseBandPoint[]) => [
    ...points.map(point => `${x(point.from)},${y(point.rowIndex)}`),
    ...points.slice().reverse().map(point => `${x(point.to)},${y(point.rowIndex)}`),
  ].join(' ');
  const toggleTarget = (target: AltitudeTargetName) => setVisibleTargets(previous => { const next = new Set(previous); next.has(target) ? next.delete(target) : next.add(target); return next; });
  const toggleEvent = (event: string) => setVisibleEvents(previous => { const next = new Set(previous); next.has(event) ? next.delete(event) : next.add(event); return next; });
  return <Stack spacing={1} aria-label={`Visibility chart in ${timeZone}`}>
    <Typography variant="subtitle1">Visibility by local time ({timeZone})</Typography>
    <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">{ALTITUDE_TARGET_NAMES.map(target => { const pressed = visibleTargets.has(target); return <Button key={target} size="small" variant={pressed ? 'contained' : 'outlined'} disabled={!availableTargets.has(target)} aria-pressed={pressed} onClick={() => toggleTarget(target)} sx={pressed ? { bgcolor: OBJECT_COLORS[target], color: '#fff', '&:hover': { bgcolor: OBJECT_COLORS[target], filter: 'brightness(.85)' } } : { color: OBJECT_COLORS[target], borderColor: OBJECT_COLORS[target] }}>{target}</Button>; })}
      {(['rise', 'transit', 'set'] as const).map(event => { const pressed = visibleEvents.has(event); return <Button key={event} size="small" variant={pressed ? 'contained' : 'outlined'} aria-pressed={pressed} onClick={() => toggleEvent(event)}>{EVENT_STYLES[event].label}</Button>; })}</Stack>
    <Stack direction="row" spacing={2.5} useFlexGap flexWrap="wrap" aria-label="Event line legend">
      {(['rise', 'transit', 'set'] as const).map(event => <Stack key={event} direction="row" spacing={.75} alignItems="center"><svg width="42" height="12" aria-hidden="true"><line x1="1" x2="41" y1="6" y2="6" stroke="#334155" strokeWidth="2" strokeDasharray={EVENT_STYLES[event].dash} strokeLinecap="round" /></svg><Typography variant="caption">{EVENT_STYLES[event].label}</Typography></Stack>)}
    </Stack>
    {!hasEvents && <Alert severity="info">No selected object has a rise, highest altitude, or set event in this range.</Alert>}
    <Box ref={containerRef} sx={{ border: 1, borderColor: 'divider' }}><svg viewBox={`0 0 ${chartWidth} ${height}`} width="100%" role="img" aria-label={`Object rise, highest altitude, and set tracks from ${formatObservingTime(window.from)} to ${formatObservingTime(window.to)} in ${timeZone}`}>
      <defs><clipPath id="visibility-night-clip" clipPathUnits="userSpaceOnUse">
        {phasePolygons.filter(polygon => polygon.phase === 'civilTwilight').map((polygon, index) => <polygon key={`${polygon.phase}-${index}`} points={phasePolygonPoints(polygon.points)} />)}
      </clipPath></defs>
      <g opacity=".68">
        <rect x={plotLeft} y={axisHeight} width={plotWidth} height={height - axisHeight} fill={SOLAR_PHASE_COLORS.day} />
        {phasePolygons.map((polygon, index) => <polygon key={`${polygon.phase}-${index}`} points={phasePolygonPoints(polygon.points)} fill={SOLAR_PHASE_COLORS[polygon.phase]} />)}
      </g>
      {Array.from({ length: (window.to - window.from) / 60 + 1 }, (_, index) => window.from + index * 60).map(minute => { const hour = (minute / 60 + 12) % 24; const midnight = minute === 720; return <g key={minute}><line x1={x(minute)} x2={x(minute)} y1={0} y2={height} stroke={midnight ? '#334155' : '#94a3b8'} strokeWidth={midnight ? gridStrokeWidthMidnight : gridStrokeWidthHour} strokeOpacity={midnight ? .9 : .45} /><text x={x(minute)} y={15} textAnchor="middle" fontSize={labelFontSize}>{minute === 1440 ? '12:00' : `${String(hour).padStart(2, '0')}:00`}</text></g>; })}
      {days.map((day, index) => <g key={day.date}>
        {isFirstAvailableDayOfMonth(day.date, days[index - 1]?.date) && <><line x1={plotLeft} x2={plotLeft + plotWidth} y1={y(index) - rowHeight / 2} y2={y(index) - rowHeight / 2} stroke="#64748b" strokeOpacity=".65" /><text x={plotLeft - 8} y={y(index) + 4} textAnchor="end" fontSize={labelFontSize}>{day.date}</text></>}
      </g>)}
      <g clipPath="url(#visibility-night-clip)">{tracks.flatMap(({ target, kind, segments }) => !visibleTargets.has(target) || !visibleEvents.has(kind)
          ? []
          : segments.map((segment, segmentIndex) => segment.length > 1 && <polyline key={`${target}-${kind}-${segmentIndex}`} points={segment.map(point => `${x(point.minute)},${y(point.rowIndex)}`).join(' ')} fill="none" stroke={OBJECT_COLORS[target]} strokeWidth={trackStrokeWidth} strokeDasharray={EVENT_STYLES[kind].dash} strokeLinecap="round" strokeLinejoin="round" />))}</g>
      {tracks.flatMap(({ target, kind, points }) => !visibleTargets.has(target) || !visibleEvents.has(kind)
        ? []
        : points.map(point => { const transit = kind === 'transit' ? point.event as VisibilityEventDto & { altitude: number } : null; const muted = transit ? transit.altitude < 0 : false; const title = `${target} ${EVENT_STYLES[kind].label}, ${days[point.dayIndex].date}, ${new Date(point.event.tde).toISOString()}${transit ? `, ${transit.altitude.toFixed(2)} deg${muted ? ', below horizon' : ''}` : ''}`; return <circle key={`${target}-${kind}-${point.dayIndex}`} cx={x(point.minute)} cy={y(point.rowIndex)} r="5" fill="transparent" stroke="transparent" tabIndex={0} aria-label={title}><title>{title}</title></circle>; }))}
    </svg></Box>
    <Box component="details"><summary>Accessible event table</summary><Box component="table" sx={{ width: '100%', borderCollapse: 'collapse', '& td, & th': { p: .5, borderBottom: 1, borderColor: 'divider', textAlign: 'left' } }}><thead><tr><th>Date</th><th>Object</th><th>Rise</th><th>Highest altitude</th><th>Set</th></tr></thead><tbody>{days.flatMap(day => ALTITUDE_TARGET_NAMES.filter(target => visibleTargets.has(target)).map(target => { const events = day.objects[target]; const format = (event: { tde: string } | null | undefined, absent: string) => event ? tableTimeFormat.format(new Date(event.tde)) : absent; return <tr key={`${day.date}-${target}`}><td>{day.date}</td><td>{target}</td><td>{format(events?.rise, 'Does not rise')}</td><td>{events?.transit ? `${format(events.transit, 'No transit')} (${events.transit.altitude.toFixed(1)} deg)` : 'No transit'}</td><td>{format(events?.set, 'No set')}</td></tr>; }))}</tbody></Box></Box>
  </Stack>;
}

export default memo(VisibilityChart);