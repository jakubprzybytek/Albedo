import { useState, type JSX } from "react";
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
  const [latitude, setLatitude] = useState(17);
  const [longitude, setLongitude] = useState(51);
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
          <NumberField label="Latitude" startAdornment="°"
            disabled={!parallaxCorrectionEnabled}
            value={latitude} onChange={setLatitude}
            validationUpdate={updateValidation('latitude')}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <NumberField label="Longitude" startAdornment="°"
            disabled={!parallaxCorrectionEnabled}
            value={longitude} onChange={setLongitude}
            validationUpdate={updateValidation('longitude')}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <NumberField label="Altitude" startAdornment="m"
            disabled={!parallaxCorrectionEnabled}
            value={altitude} onChange={setAltitude}
            validationUpdate={updateValidation('altitude')} />
        </Grid>
      </Grid>
      <QuerySubmit loading={query.loading} disabled={!isValid()}
        success={query.successMessage}
        error={query.errorMessage}
        onSubmit={handleSubmit} />
    </QueryPanel>
  );
}
