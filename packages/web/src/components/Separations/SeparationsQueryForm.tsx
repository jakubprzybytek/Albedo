import { useState, type JSX } from "react";
import Stack from "@mui/material/Stack";
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { addMonths, format, set } from 'date-fns';
import QueryPanel from "@/forms/QueryPanel";
import type { ManagedQuery } from "@/forms/useQuery";
import type { SeparationsQuery } from "@/sdk/GetSeparations";
import { useValidation } from "@/forms";
import QuerySubmit from "@/forms/QuerySubmit";
import NumberField from "@/forms/NumberField";

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
  const [longitude, setLongitude] = useState(17);
  const [latitude, setLatitude] = useState(51);
  const [altitude, setAltitude] = useState(50);

  const { updateValidation, isValid } = useValidation();

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
      <Stack spacing={2}>
        <Grid container rowSpacing={2} columnSpacing={1}>
          <Grid size={{ xs: 6, sm: 4 }}>
            <TextField label="Target" size="small"
              value={target}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setTarget(event.target.value);
              }}
            />
          </Grid>
          <Grid size={{ xs: 6, sm: 4 }}>
            <TextField label="Observer" size="small"
              value={observer}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setObserver(event.target.value);
              }}
            />
          </Grid>
        </Grid>
        <Grid container rowSpacing={2} columnSpacing={1}>
          <Grid size={{ xs: 8, sm: 4 }}>
            <DateTimePicker label="From (TDE)" sx={{ width: '100%', '& > div': { height: 40 } }}
              value={fromTde}
              onChange={(newValue) => setFromTde(newValue)} />
          </Grid>
          <Grid size={{ xs: 8, sm: 4 }}>
            <DateTimePicker label="To (TDE)" sx={{ width: '100%', '& > div': { height: 40 } }}
              value={toTde}
              onChange={(newValue) => setToTde(newValue)} />
          </Grid>
          <Grid size={{ xs: 6, sm: 4 }}>
            <TextField label="Interval" size="small" type="number"
              value={interval}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setInterval(Number(event.target.value));
              }}
            />
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
              validationUpdate={updateValidation('latitude')} />
          </Grid>
          <Grid size={{ xs: 4, sm: 3 }}>
            <NumberField label="Longitude (E)" startAdornment="°"
              disabled={!parallaxCorrectionEnabled}
              value={longitude} onChange={setLongitude}
              validationUpdate={updateValidation('longitude')} />
          </Grid>
          <Grid size={{ xs: 4, sm: 3 }}>
            <NumberField label="Altitude" startAdornment="m"
              disabled={!parallaxCorrectionEnabled}
              value={altitude} onChange={setAltitude}
              validationUpdate={updateValidation('altitude')} />
          </Grid>
          <QuerySubmit loading={query.loading} disabled={!isValid()}
            success={query.successMessage}
            error={query.errorMessage}
            onSubmit={handleSubmit} />
        </Grid>
      </Stack>
    </QueryPanel>
  );
}