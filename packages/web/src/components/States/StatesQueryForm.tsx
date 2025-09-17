import { useState, type JSX } from "react";
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { addMonths, format } from 'date-fns';
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select, { type SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import QuerySubmit from "@/forms/QuerySubmit";
import QueryPanel from "@/forms/QueryPanel";
import type { StatesQuery } from "@/sdk/States";
import type { ManagedQuery } from "@/forms/useQuery";
import { Stack } from "@mui/material";

type StatesQueryFormParams = {
  query: ManagedQuery<StatesQuery>;
};

export default function StatesQueryForm({ query }: StatesQueryFormParams): JSX.Element {
  const [target, setTarget] = useState('Earth');
  const [observer, setObserver] = useState('Solar System Barycenter');
  const [fromTde, setFromTde] = useState<Date | null>(new Date());
  const [toTde, setToTde] = useState<Date | null>(addMonths(new Date(), 1));
  const [interval, setInterval] = useState(1);
  const [correction, setCorrection] = useState('LT');

  function handleSubmit() {
    query.submit({
      target,
      observer,
      fromTde: fromTde ? format(fromTde, 'yyyy-MM-dd') : '',
      toTde: toTde ? format(toTde, 'yyyy-MM-dd') : '',
      interval,
      correction
    });
  }

  return (
    <QueryPanel>
      <Stack spacing={2}>
        <Grid container columnSpacing={1}>
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
        <Grid container rowSpacing={1} columnSpacing={1}>
          <Grid size={{ xs: 6, sm: 4 }}>
            <DatePicker label="From (TDE)" sx={{ width: '100%', '& > div': { height: 40 } }}
              value={fromTde} onChange={(newValue) => setFromTde(newValue)} />
          </Grid>
          <Grid size={{ xs: 6, sm: 4 }}>
            <DatePicker label="To (TDE)" sx={{ width: '100%', '& > div': { height: 40 } }}
              value={toTde} onChange={(newValue) => setToTde(newValue)} />
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
        <Grid container>
          <Grid size={{ xs: 12, sm: 6 }}>
            <FormControl sx={{}} size="small" fullWidth>
              <InputLabel id="correction-label">Correction</InputLabel>
              <Select labelId="correction-label" label="Correction"
                value={correction}
                onChange={(event: SelectChangeEvent) => setCorrection(event.target.value)}>
                <MenuItem value="NONE">None</MenuItem>
                <MenuItem value="LT">Light Time</MenuItem>
                <MenuItem value="CN">Converged Newtonian Light Time</MenuItem>
                <MenuItem value="LT+S">Light Time and Stellar Abberation</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Stack>
      <QuerySubmit loading={query.loading} success={query.successMessage} error={query.errorMessage} onSubmit={handleSubmit} />
    </QueryPanel>
  );
}
