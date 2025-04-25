import { useState, type JSX } from "react";
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { addMonths, format } from 'date-fns';
import QueryPanel from "../../forms/QueryPanel";
import type { StatesQuery } from "@/sdk/GetStates";
import type { ManagedQuery } from "@/forms/useQuery";

type StatesQueryFormParams = {
  query: ManagedQuery<StatesQuery>;
};

export default function StatesQueryForm({ query }: StatesQueryFormParams): JSX.Element {
  const [target, setTarget] = useState('Earth');
  const [observer, setObserver] = useState('Solar System Barycenter');
  const [fromTde, setFromTde] = useState<Date | null>(new Date());
  const [toTde, setToTde] = useState<Date | null>(addMonths(new Date(), 1));
  const [interval, setInterval] = useState(1);

  function handleSubmit() {
    query.submit({
      target,
      observer,
      fromTde: fromTde ? format(fromTde, 'yyyy-MM-dd') : '',
      toTde: toTde ? format(toTde, 'yyyy-MM-dd') : '',
      interval
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
          <DatePicker label="From (TDE)" sx={{ '& > div': { height: 40 } }}
            value={fromTde} onChange={(newValue) => setFromTde(newValue)} />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <DatePicker label="To (TDE)" sx={{ '& > div': { height: 40 } }}
            value={toTde} onChange={(newValue) => setToTde(newValue)} />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <TextField label="Interval" size="small" type="number"
            value={interval}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setInterval(Number(event.target.value));
            }}
          />
        </Grid>
        <Grid container height={48} width="100%" justifyContent={'space-between'} alignItems={'flex-end'}>
          <Grid >
            {query.successMessage && <Alert severity="success">{query.successMessage}</Alert>}
            {query.errorMessage && <Alert severity="error">{query.errorMessage}</Alert>}
          </Grid>
          <Grid>
            <Button variant="contained" size="small" loading={query.loading} onClick={handleSubmit}>Submit</Button>
          </Grid>
        </Grid>
      </Grid>
    </QueryPanel>
  );
}
