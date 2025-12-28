import { useState, type JSX } from "react";
import Stack from "@mui/material/Stack";
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { addMonths, format } from 'date-fns';
import QueryPanel from "@/forms/QueryPanel";
import QuerySubmit from "@/forms/QuerySubmit";
import type { ManagedQuery } from "@/forms/useQuery";
import type { Location } from "@/common/Profile";
import type { EphemeridesQuery } from "@/sdk/Ephemerides";
import ObserverLocationFields from "../commons/ObserverLocationFields";
import { useValidation } from "@/forms";

type EphemerisQueryFormParams = {
  query: ManagedQuery<EphemeridesQuery>;
};

export default function EphemerisQueryForm({ query }: EphemerisQueryFormParams): JSX.Element {
  const [target, setTarget] = useState('Venus');
  const [fromTde, setFromTde] = useState<Date | null>(new Date());
  const [toTde, setToTde] = useState<Date | null>(addMonths(new Date(), 1));
  const [interval, setInterval] = useState(1);
  const [observerLocation, setObserverLocation] = useState<Location>({
    latitude: 51,
    longitude: 17,
    altitude: 50
  });

  const { updateValidation, isValid } = useValidation();

  function handleSubmit() {
    query.submit({
      target,
      fromTde: fromTde ? format(fromTde, 'yyyy-MM-dd') : '',
      toTde: toTde ? format(toTde, 'yyyy-MM-dd') : '',
      interval,
      location: observerLocation
    });
  }

  return (
    <QueryPanel>
      <Stack spacing={2}>
        <Grid container rowSpacing={2} columnSpacing={1}>
          <Grid size={6}>
            <TextField label="Target" size="small"
              value={target}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setTarget(event.target.value);
              }}
            />
          </Grid>
        </Grid>
        <Grid container rowSpacing={1} columnSpacing={1}>
          <Grid size={{ xs: 6, sm: 4 }}>
            <DatePicker label="From (TDE)" sx={{ width: '100%', '& > div': { height: 40 } }}
              value={fromTde}
              onChange={(newValue) => setFromTde(newValue)} />
          </Grid>
          <Grid size={{ xs: 6, sm: 4 }}>
            <DatePicker label="To (TDE)" sx={{ width: '100%', '& > div': { height: 40 } }}
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
          <ObserverLocationFields
            location={observerLocation}
            onChanged={setObserverLocation}
            updateValidation={updateValidation} />
        </Grid>
      </Stack>
      <QuerySubmit loading={query.loading} disabled={!isValid()}
        success={query.successMessage}
        error={query.errorMessage}
        onSubmit={handleSubmit} />
    </QueryPanel >
  );
}
