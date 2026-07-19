import { useState, type JSX } from 'react';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import Grid from '@mui/material/Grid';
import InputLabel from '@mui/material/InputLabel';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import Select, { type SelectChangeEvent } from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import type { Location } from '@/common/Profile';
import QueryPanel from '@/forms/QueryPanel';
import QuerySubmit from '@/forms/QuerySubmit';
import { useValidation } from '@/forms';
import type { ManagedQuery } from '@/forms/useQuery';
import type { AltitudesQuery } from '@/sdk/Altitudes';
import ObserverLocationFields from '../commons/ObserverLocationFields';
import { ALTITUDE_TARGET_NAMES, type AltitudeTargetName } from './altitudeTypes';

const MAX_RANGE_MILLISECONDS = 7 * 24 * 60 * 60 * 1000;

function nextNightStart(): Date {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 12));
}

function utcToPickerDate(date: Date): Date {
  return new Date(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate(),
    date.getUTCHours(),
    date.getUTCMinutes(),
    date.getUTCSeconds(),
  );
}

function pickerDateToUtc(date: Date | null): Date | undefined {
  if (!date || Number.isNaN(date.getTime())) {
    return undefined;
  }
  return new Date(Date.UTC(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    date.getHours(),
    date.getMinutes(),
    date.getSeconds(),
  ));
}

type AltitudesQueryFormProps = {
  query: ManagedQuery<AltitudesQuery>;
};

export default function AltitudesQueryForm({ query }: AltitudesQueryFormProps): JSX.Element {
  const initialStart = nextNightStart();
  const [targets, setTargets] = useState<AltitudeTargetName[]>([...ALTITUDE_TARGET_NAMES]);
  const [fromTde, setFromTde] = useState<Date | null>(() => utcToPickerDate(initialStart));
  const [toTde, setToTde] = useState<Date | null>(() => utcToPickerDate(new Date(initialStart.getTime() + 24 * 60 * 60 * 1000)));
  const [location, setLocation] = useState<Location>({ latitude: 51, longitude: 17, altitude: 50 });
  const { updateValidation, isValid } = useValidation();

  const from = pickerDateToUtc(fromTde);
  const to = pickerDateToUtc(toTde);
  const rangeValid = Boolean(from && to && from < to && to.getTime() - from.getTime() <= MAX_RANGE_MILLISECONDS);
  const dateError = !rangeValid;
  const dateHelper = !from || !to
    ? 'Provide valid UTC date-times'
    : from >= to
      ? 'Start must be earlier than End'
      : to.getTime() - from.getTime() > MAX_RANGE_MILLISECONDS
        ? 'Range must not exceed 7 days'
        : undefined;
  const valid = targets.length > 0 && rangeValid && isValid();

  function submit() {
    if (!from || !to || !valid) {
      return;
    }
    void query.submit({
      targets,
      fromTde: from.toISOString(),
      toTde: to.toISOString(),
      location,
    });
  }

  function changeTargets(event: SelectChangeEvent<AltitudeTargetName[]>) {
    const value = event.target.value;
    setTargets((typeof value === 'string' ? value.split(',') : value) as AltitudeTargetName[]);
  }

  return (
    <QueryPanel>
      <Stack spacing={2}>
        <FormControl size="small" fullWidth error={targets.length === 0}>
          <InputLabel id="altitude-targets-label">Objects</InputLabel>
          <Select aria-label="Objects" labelId="altitude-targets-label" label="Objects" multiple value={targets}
            renderValue={selected => selected.join(', ')} onChange={changeTargets}>
            {ALTITUDE_TARGET_NAMES.map(target => (
              <MenuItem key={target} value={target}>
                <Checkbox checked={targets.includes(target)} />
                <ListItemText primary={target} />
              </MenuItem>
            ))}
          </Select>
          {targets.length === 0 && <span>Choose at least one object</span>}
        </FormControl>
        <Grid container rowSpacing={1} columnSpacing={1}>
          <Grid size={{ xs: 6, sm: 6 }}>
            <DateTimePicker label="Start (UTC)" value={fromTde} onChange={setFromTde}
              slotProps={{ textField: { size: 'small', error: dateError, helperText: dateError ? dateHelper : undefined, inputProps: { 'aria-label': 'Start (UTC)' } } }} />
          </Grid>
          <Grid size={{ xs: 6, sm: 6 }}>
            <DateTimePicker label="End (UTC)" value={toTde} onChange={setToTde}
              slotProps={{ textField: { size: 'small', error: dateError, helperText: dateError ? dateHelper : undefined, inputProps: { 'aria-label': 'End (UTC)' } } }} />
          </Grid>
          <ObserverLocationFields disabled={query.loading} location={location} onChanged={setLocation} updateValidation={updateValidation} />
        </Grid>
      </Stack>
      <QuerySubmit loading={query.loading} disabled={!valid || query.loading}
        success={query.successMessage} error={query.errorMessage} onSubmit={submit} />
    </QueryPanel>
  );
}