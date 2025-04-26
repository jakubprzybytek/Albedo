import { type JSX } from "react";
import Grid from '@mui/material/Grid';
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";

type QuerySubmitParams = {
  loading: boolean;
  success?: string;
  error?: string;
  onSubmit: () => void;
};

export default function QuerySubmit({ loading, success, error, onSubmit }: QuerySubmitParams): JSX.Element {
  return (
    <Grid container height={48} width="100%" justifyContent={'space-between'} alignItems={'flex-end'}>
      <Grid >
        {success && <Alert severity="success">{success}</Alert>}
        {error && <Alert severity="error">{error}</Alert>}
      </Grid>
      <Grid>
        <Button variant="contained" size="small" loading={loading} onClick={onSubmit}>Submit</Button>
      </Grid>
    </Grid>
  );
}
