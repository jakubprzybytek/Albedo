import type { JSX } from 'react';
import { useState } from 'react';
import { useTheme } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import NumberField from '@/forms/NumberField';
import { useValidation } from '@/forms';
import { Paper } from '@mui/material';

export default function SettingsDialog(): JSX.Element {
  const [latitude, setLatitude] = useState(51);
  const [longitude, setLongitude] = useState(17);
  const [altitude, setAltitude] = useState(50);

  const { updateValidation, isValid } = useValidation();

  const theme = useTheme();

  return (
    <Paper sx={{
      margin: 1,
      padding: 1,
      backgroundColor: theme.palette.grey[200],
      '& .MuiTextField-root': {
        width: '100%',
      }
    }}>
      <Grid container rowSpacing={1} columnSpacing={1}>
        <Grid size={12}>
          <Typography variant="h6">Location</Typography>
        </Grid>
        <Grid size={{ xs: 4, sm: 3 }}>
          <NumberField label="Latitude (N)" startAdornment="°"
            value={latitude} onChange={setLatitude}
            validationUpdate={updateValidation('latitude')}
          />
        </Grid>
        <Grid size={{ xs: 4, sm: 3 }}>
          <NumberField label="Longitude (E)" startAdornment="°"
            value={longitude} onChange={setLongitude}
            validationUpdate={updateValidation('longitude')}
          />
        </Grid>
        <Grid size={{ xs: 4, sm: 3 }}>
          <NumberField label="Altitude" startAdornment="m"
            value={altitude} onChange={setAltitude}
            validationUpdate={updateValidation('altitude')} />
        </Grid>
      </Grid>
    </Paper>
  );
}
