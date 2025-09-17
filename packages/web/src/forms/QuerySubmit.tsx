import { type JSX } from "react";
import Grid from '@mui/material/Grid';
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";

type QuerySubmitParams = {
  disabled?: boolean;
  loading: boolean;
  success?: string;
  error?: string;
  onSubmit: () => void;
};

export default function QuerySubmit({ disabled, loading, success, error, onSubmit }: QuerySubmitParams): JSX.Element {
  return (
    <Grid container minHeight={48} width="100%" spacing={1} justifyContent={'space-between'} alignItems={'flex-end'}>
      <Grid >
        {success && <Alert severity="success">{success}</Alert>}
        {error && <Alert severity="error">{error}</Alert>}
      </Grid>
      <Grid>
        <Button variant="contained" size="small" className="submit"
          disabled={disabled}
          loading={loading}
          onClick={onSubmit}>Submit</Button>
      </Grid>
    </Grid>
  );
}
