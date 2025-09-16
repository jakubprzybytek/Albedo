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
import NumberField from "@/forms/NumberField";

type EclipsesQueryFormParams = {
  query: ManagedQuery<EclipsesQuery>;
};

export default function EclipsesQueryForm({ query }: EclipsesQueryFormParams): JSX.Element {
  const [fromTde, setFromTde] = useState<Date | null>(new Date());
  const [toTde, setToTde] = useState<Date | null>(addMonths(new Date(), 6));
  const [parallaxCorrectionEnabled, setParallaxCorrectionEnabled] = useState(false);
  const [latitude, setLatitude] = useState(17);
  const [longitude, setLongitude] = useState(51);
  const [altitude, setAltitude] = useState(50);

  function handleSubmit() {
    query.submit({
      fromTde: fromTde ? format(fromTde, 'yyyy-MM-dd') : '',
      toTde: toTde ? format(toTde, 'yyyy-MM-dd') : '',
      ...(parallaxCorrectionEnabled && {
        latitude,
        longitude,
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
          <NumberField label="Latitude"
            disabled={!parallaxCorrectionEnabled}
            value={latitude} setValue={setLatitude}
            startAdornment="°" />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <NumberField label="Longitude"
            disabled={!parallaxCorrectionEnabled}
            value={longitude} setValue={setLongitude}
            startAdornment="°" />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <NumberField label="Altitude"
            disabled={!parallaxCorrectionEnabled}
            value={altitude} setValue={setAltitude}
            startAdornment="m" />
        </Grid>
      </Grid>
      <QuerySubmit loading={query.loading} success={query.successMessage} error={query.errorMessage} onSubmit={handleSubmit} />
    </QueryPanel>
  );
}
