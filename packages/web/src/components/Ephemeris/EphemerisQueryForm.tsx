import { useState, type JSX } from "react";
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { addMonths, format } from 'date-fns';
import QueryPanel from "@/forms/QueryPanel";
import QuerySubmit from "@/forms/QuerySubmit";
import type { ManagedQuery } from "@/forms/useQuery";
import type { EphemeridesQuery } from "@/sdk/GetEphemerides";

type EphemerisQueryFormParams = {
  query: ManagedQuery<EphemeridesQuery>;
};

export default function EphemerisQueryForm({ query }: EphemerisQueryFormParams): JSX.Element {
  const [target, setTarget] = useState('Venus');
  const [fromTde, setFromTde] = useState<Date | null>(new Date());
  const [toTde, setToTde] = useState<Date | null>(addMonths(new Date(), 1));
  const [interval, setInterval] = useState(1);

  function handleSubmit() {
    query.submit({
      target,
      fromTde: fromTde ? format(fromTde, 'yyyy-MM-dd') : '',
      toTde: toTde ? format(toTde, 'yyyy-MM-dd') : '',
      interval
    });
  }

  return (
    <QueryPanel>
      <Grid container rowSpacing={2} columnSpacing={1}>
        <Grid size={12}>
          <TextField label="Target" size="small"
            value={target}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setTarget(event.target.value);
            }}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <DatePicker label="From (TDE)" sx={{ '& > div': { height: 40 } }}
            value={fromTde}
            onChange={(newValue) => setFromTde(newValue)} />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <DatePicker label="To (TDE)" sx={{ '& > div': { height: 40 } }}
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
        <QuerySubmit loading={query.loading} success={query.successMessage} error={query.errorMessage} onSubmit={handleSubmit} />
      </Grid>
    </QueryPanel >
  );
}
