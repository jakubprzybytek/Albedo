import { useState, type JSX } from "react";
import Stack from "@mui/material/Stack";
import Grid from '@mui/material/Grid';
import QueryPanel from "@/forms/QueryPanel";
import QuerySubmit from "@/forms/QuerySubmit";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { addMonths, format } from 'date-fns';
import type { EclipsesQuery } from "@/sdk/Eclipses";
import { type ManagedQuery, useValidation } from "@/forms";
import NumberField from "@/forms/NumberField";

type EclipsesQueryFormParams = {
  query: ManagedQuery<EclipsesQuery>;
};

export default function EclipsesQueryForm({ query }: EclipsesQueryFormParams): JSX.Element {
  const [fromTde, setFromTde] = useState<Date | null>(new Date());
  const [toTde, setToTde] = useState<Date | null>(addMonths(new Date(), 6));
  const [parallaxCorrectionEnabled, setParallaxCorrectionEnabled] = useState(false);
  const [latitude, setLatitude] = useState(51);
  const [longitude, setLongitude] = useState(17);
  const [altitude, setAltitude] = useState(50);

  const { updateValidation, isValid } = useValidation();

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
      <Stack spacing={1}>

        <Grid container columnSpacing={1}>
          <Grid size={{ xs: 6, sm: 4 }}>
            <DatePicker label="From (TDE)" sx={{ width: '100%', '& > div': { height: 40 } }}
              value={fromTde}
              onChange={(newValue) => setFromTde(newValue)} />
          </Grid>
          <Grid size={{ xs: 6, sm: 4 }}>
            <DatePicker label="To (TDE)" sx={{ width: '100%', '& > div': { height: 40 } }}
              value={toTde} onChange={(newValue) => setToTde(newValue)} />
          </Grid>
        </Grid>
        <Grid container rowSpacing={1} columnSpacing={1}>
          <Grid size={12}>
            <FormControlLabel control={<Checkbox size="small" sx={{ paddingTop: 0, paddingBottom: 0 }}
              checked={parallaxCorrectionEnabled}
              onChange={(event) => setParallaxCorrectionEnabled(event.target.checked)} />} label="Parallax correction" />
          </Grid>
          <Grid size={{ xs: 4, sm: 3 }}>
            <NumberField label="Latitude (N)" startAdornment="°"
              disabled={!parallaxCorrectionEnabled}
              value={latitude} onChange={setLatitude}
              validationUpdate={updateValidation('latitude')}
            />
          </Grid>
          <Grid size={{ xs: 4, sm: 3 }}>
            <NumberField label="Longitude (E)" startAdornment="°"
              disabled={!parallaxCorrectionEnabled}
              value={longitude} onChange={setLongitude}
              validationUpdate={updateValidation('longitude')}
            />
          </Grid>
          <Grid size={{ xs: 4, sm: 3 }}>
            <NumberField label="Altitude" startAdornment="m"
              disabled={!parallaxCorrectionEnabled}
              value={altitude} onChange={setAltitude}
              validationUpdate={updateValidation('altitude')} />
          </Grid>
        </Grid>
      </Stack>
      <QuerySubmit loading={query.loading} disabled={!isValid()}
        success={query.successMessage}
        error={query.errorMessage}
        onSubmit={handleSubmit} />
    </QueryPanel>
  );
}
