import { useState, type JSX } from "react";
import Grid from '@mui/material/Grid';
import QueryPanel from "@/forms/QueryPanel";
import QuerySubmit from "@/forms/QuerySubmit";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import InputAdornment from "@mui/material/InputAdornment";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { addMonths, format } from 'date-fns';
import type { EclipsesQuery } from "@/sdk/Eclipses";
import type { ManagedQuery } from "@/forms/useQuery";

type EclipsesQueryFormParams = {
  query: ManagedQuery<EclipsesQuery>;
};

export default function EclipsesQueryForm({ query }: EclipsesQueryFormParams): JSX.Element {
  const [fromTde, setFromTde] = useState<Date | null>(new Date());
  const [toTde, setToTde] = useState<Date | null>(addMonths(new Date(), 6));
  const [parallaxCorrectionEnabled, setParallaxCorrectionEnabled] = useState(false);
  const [longitude, setLongitude] = useState(51);
  const [latitude, setLatitude] = useState(17);
  const [altitude, setAltitude] = useState(50);

  function handleSubmit() {
    query.submit({
      fromTde: fromTde ? format(fromTde, 'yyyy-MM-dd') : '',
      toTde: toTde ? format(toTde, 'yyyy-MM-dd') : '',
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
        <Grid size={{ xs: 12, sm: 4 }}>
          <DatePicker label="From (TDE)" sx={{ '& > div': { height: 40 } }}
            value={fromTde}
            onChange={(newValue) => setFromTde(newValue)} />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <DatePicker label="To (TDE)" sx={{ '& > div': { height: 40 } }}
            value={toTde} onChange={(newValue) => setToTde(newValue)} />
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
      </Grid>
      <QuerySubmit loading={query.loading} success={query.successMessage} error={query.errorMessage} onSubmit={handleSubmit} />
    </QueryPanel>
  );
}
