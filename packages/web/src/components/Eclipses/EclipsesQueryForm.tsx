import { useState, type JSX } from "react";
import Grid from '@mui/material/Grid';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { addMonths, format } from 'date-fns';
import type { EclipsesQuery } from "@/sdk/Eclipses";
import QueryPanel from "@/forms/QueryPanel";
import QuerySubmit from "@/forms/QuerySubmit";
import type { ManagedQuery } from "@/forms/useQuery";

type EclipsesQueryFormParams = {
  query: ManagedQuery<EclipsesQuery>;
};

export default function EclipsesQueryForm({ query }: EclipsesQueryFormParams): JSX.Element {
  const [fromTde, setFromTde] = useState<Date | null>(new Date());
  const [toTde, setToTde] = useState<Date | null>(addMonths(new Date(), 6));

  function handleSubmit() {
    query.submit({
      fromTde: fromTde ? format(fromTde, 'yyyy-MM-dd') : '',
      toTde: toTde ? format(toTde, 'yyyy-MM-dd') : '',
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
      </Grid>
      <QuerySubmit loading={query.loading} success={query.successMessage} error={query.errorMessage} onSubmit={handleSubmit} />
    </QueryPanel>
  );
}
