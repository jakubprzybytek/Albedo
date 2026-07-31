import { useMemo, type JSX } from 'react';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import Grid from '@mui/material/Grid';
import InputLabel from '@mui/material/InputLabel';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import Select, { type SelectChangeEvent } from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { addYears, format, isBefore, isValid, parseISO } from 'date-fns';
import type { Location } from '@/common/Profile';
import QueryPanel from '@/forms/QueryPanel';
import QuerySubmit from '@/forms/QuerySubmit';
import { useValidation } from '@/forms';
import ObserverLocationFields from '@/components/commons/ObserverLocationFields';
import type { VisibilityQuery } from '@/sdk/Visibility';
import { ALTITUDE_TARGET_NAMES, type AltitudeTargetName } from '@/components/Altitudes/altitudeTypes';
import { useLocalStorage } from '@/utils';

type Props = { loading: boolean; error?: string; onSubmit: (query: VisibilityQuery) => void };

function browserTimeZone(): string {
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
  try { new Intl.DateTimeFormat(undefined, { timeZone }); return timeZone; } catch { return 'UTC'; }
}

function yearInZone(timeZone: string): number {
  return Number(new Intl.DateTimeFormat('en-CA', { timeZone, year: 'numeric' }).format(new Date()));
}

function parseDateString(value: string | null): Date | null {
  if (!value) return null;
  const date = parseISO(value);
  return isValid(date) ? date : null;
}

export default function VisibilityQueryForm({ loading, error, onSubmit }: Props): JSX.Element {
  const initialZone = useMemo(browserTimeZone, []);
  const initialYear = useMemo(() => yearInZone(initialZone), [initialZone]);
  const [targets, setTargets] = useLocalStorage<AltitudeTargetName[]>('visibility.targets', [...ALTITUDE_TARGET_NAMES]);
  const [fromDateStr, setFromDateStr] = useLocalStorage<string | null>('visibility.fromDate', format(new Date(initialYear, 0, 1), 'yyyy-MM-dd'));
  const [toDateStr, setToDateStr] = useLocalStorage<string | null>('visibility.toDate', format(new Date(initialYear, 11, 31), 'yyyy-MM-dd'));
  const fromDate = parseDateString(fromDateStr);
  const toDate = parseDateString(toDateStr);
  const [timeZone, setTimeZone] = useLocalStorage<string>('visibility.timeZone', initialZone);
  const [location, setLocation] = useLocalStorage<Location>('visibility.location', { latitude: 51, longitude: 17, altitude: 50 });
  const { updateValidation, isValid } = useValidation();
  const datesValid = Boolean(fromDate && toDate && isValid(fromDate) && isValid(toDate) && !isBefore(toDate, fromDate) && isBefore(toDate, addYears(fromDate, 10)));
  const zoneValid = (() => { try { new Intl.DateTimeFormat(undefined, { timeZone }); return true; } catch { return false; } })();
  const valid = targets.length > 0 && datesValid && zoneValid && isValid();

  function changeTargets(event: SelectChangeEvent<AltitudeTargetName[]>) {
    const value = event.target.value;
    setTargets((typeof value === 'string' ? value.split(',') : value) as AltitudeTargetName[]);
  }

  return <QueryPanel><Stack spacing={2}>
    <FormControl size="small" fullWidth error={!targets.length}><InputLabel id="visibility-targets">Objects</InputLabel>
      <Select labelId="visibility-targets" label="Objects" multiple value={targets} renderValue={selected => selected.join(', ')} onChange={changeTargets}>
        {ALTITUDE_TARGET_NAMES.map(target => <MenuItem key={target} value={target}><Checkbox checked={targets.includes(target)} /><ListItemText primary={target} /></MenuItem>)}
      </Select>
    </FormControl>
    <Grid container spacing={1}>
      <Grid size={{ xs: 6, sm: 4 }}><DatePicker label="From date" value={fromDate} onChange={date => setFromDateStr(date && isValid(date) ? format(date, 'yyyy-MM-dd') : null)} slotProps={{ textField: { size: 'small', error: !datesValid, inputProps: { 'aria-label': 'From date' } } }} /></Grid>
      <Grid size={{ xs: 6, sm: 4 }}><DatePicker label="To date" value={toDate} onChange={date => setToDateStr(date && isValid(date) ? format(date, 'yyyy-MM-dd') : null)} slotProps={{ textField: { size: 'small', error: !datesValid, helperText: !datesValid ? 'Use an ordered range shorter than ten calendar years' : undefined, inputProps: { 'aria-label': 'To date' } } }} /></Grid>
      <Grid size={{ xs: 12, sm: 4 }}><TextField size="small" label="Time zone" value={timeZone} onChange={event => setTimeZone(event.target.value)} error={!zoneValid} helperText={!zoneValid ? 'Use an IANA time zone' : undefined} /></Grid>
      <ObserverLocationFields disabled={loading} location={location} onChanged={setLocation} updateValidation={updateValidation} />
    </Grid>
  </Stack><QuerySubmit loading={loading} disabled={!valid || loading} error={error} onSubmit={() => { if (fromDate && toDate) onSubmit({ targets, fromDate: format(fromDate, 'yyyy-MM-dd'), toDate: format(toDate, 'yyyy-MM-dd'), timeZone, location }); }} /></QueryPanel>;
}