import { useState, type JSX } from "react";
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import InputAdornment from "@mui/material/InputAdornment";
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { addMonths, format, set } from 'date-fns';
import QueryPanel from "@/forms/QueryPanel";
import type { ManagedQuery } from "@/forms/useQuery";
import type { SeparationsQuery } from "@/sdk/GetSeparations";
import QuerySubmit from "@/forms/QuerySubmit";

type SeparationsQueryFormParams = {
  query: ManagedQuery<SeparationsQuery>;
};

export default function SeparationsQueryForm({ query }: SeparationsQueryFormParams): JSX.Element {
  const [target, setTarget] = useState('Mercury');
  const [observer, setObserver] = useState('Venus');
  const [fromTde, setFromTde] = useState<Date | null>(set(new Date(), { hours: 0, minutes: 0, seconds: 0, milliseconds: 0 }));
  const [toTde, setToTde] = useState<Date | null>(addMonths(set(new Date(), { hours: 0, minutes: 0, seconds: 0, milliseconds: 0 }), 1));
  const [interval, setInterval] = useState(1);
  const [parallaxCorrectionEnabled, setParallaxCorrectionEnabled] = useState(false);
  const [longitude, setLongitude] = useState(51);
  const [latitude, setLatitude] = useState(17);
  const [altitude, setAltitude] = useState(50);

  function handleSubmit() {
    query.submit({
      target,
      observer,
      fromTde: fromTde ? format(fromTde, "yyyy-MM-dd'T'HH:mm'Z'") : '',
      toTde: toTde ? format(toTde, "yyyy-MM-dd'T'HH:mm'Z'") : '',
      interval,
      ...(parallaxCorrectionEnabled && {
        longitude,
        latitude,
        altitude
      }),
    });
  }

  return (
    <QueryPanel>
      <Grid container rowSpacing={2} columnSpacing={1}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField label="Target" size="small"
            value={target}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setTarget(event.target.value);
            }}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField label="Observer" size="small"
            value={observer}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setObserver(event.target.value);
            }}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <DateTimePicker label="From (TDE)" sx={{ '& > div': { height: 40 } }}
            value={fromTde}
            onChange={(newValue) => setFromTde(newValue)} />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <DateTimePicker label="To (TDE)" sx={{ '& > div': { height: 40 } }}
            value={toTde}
            onChange={(newValue) => setToTde(newValue)} />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <TextField label="Interval" size="small" type="number"
            value={interval}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setInterval(Number(event.target.value));
            }}
          />
        </Grid>
        <Grid size={12}>
          <FormControlLabel control={<Checkbox checked={parallaxCorrectionEnabled} onChange={(event) => setParallaxCorrectionEnabled(event.target.checked)} />} label="Parallax correction" />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <TextField label="Longitude" size="small" type="number"
            slotProps={{
              input: { startAdornment: <InputAdornment position="start">°</InputAdornment> },
            }}
            disabled={!parallaxCorrectionEnabled}
            value={longitude}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setLongitude(Number(event.target.value));
            }}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <TextField label="Latitude" size="small"
            slotProps={{
              input: { startAdornment: <InputAdornment position="start">°</InputAdornment> },
            }}
            disabled={!parallaxCorrectionEnabled}
            value={latitude}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setLatitude(Number(event.target.value));
            }}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <TextField label="Altitude" size="small"
            slotProps={{
              input: { startAdornment: <InputAdornment position="start">m</InputAdornment> },
            }}
            disabled={!parallaxCorrectionEnabled}
            value={altitude}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setAltitude(Number(event.target.value));
            }}
          />
        </Grid>
        <QuerySubmit loading={query.loading} success={query.successMessage} error={query.errorMessage} onSubmit={handleSubmit} />
      </Grid>
    </QueryPanel>
  );
}