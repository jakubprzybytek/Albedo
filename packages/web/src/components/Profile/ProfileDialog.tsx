import type { JSX } from 'react';
import { useState } from 'react';
import { useTheme } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import Typography from '@mui/material/Typography';
import NumberField from '@/forms/NumberField';
import { useValidation } from '@/forms';
import { useProfile } from './useProfile';

export default function ProfileDialog(): JSX.Element {
  const [profile, updateProfile] = useProfile();

  const [latitude, setLatitude] = useState(profile.location.latitude);
  const [longitude, setLongitude] = useState(profile.location.longitude);
  const [altitude, setAltitude] = useState(profile.location.altitude);

  const [profileUpdated, setProfileUpdated] = useState(false);

  const { updateValidation, isValid } = useValidation();

  function handleProfileSave() {
    updateProfile({
      location: {
        latitude,
        longitude,
        altitude
      }
    });
    setProfileUpdated(true);
  }

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
          <Typography variant="subtitle1">Location</Typography>
        </Grid>
        <Grid size={{ xs: 6, sm: 4, md: 3 }}>
          <NumberField label="Latitude (N)" startAdornment="°"
            value={latitude} onChange={setLatitude}
            validateValue={(value: number) => value >= -90 && value <= 90}
            validationErrorMessage='Provide number between -90 and 90'
            validationUpdate={updateValidation('latitude')}
          />
        </Grid>
        <Grid size={{ xs: 6, sm: 4, md: 3 }}>
          <NumberField label="Longitude (E)" startAdornment="°"
            value={longitude} onChange={setLongitude}
            validateValue={(value: number) => value >= -180 && value <= 180}
            validationErrorMessage='Provide number between -180 and 180'
            validationUpdate={updateValidation('longitude')}
          />
        </Grid>
        <Grid size={{ xs: 6, sm: 4, md: 3 }}>
          <NumberField label="Altitude" startAdornment="m"
            value={altitude} onChange={setAltitude}
            validateValue={(value: number) => value >= 0}
            validationErrorMessage='Provide number greater than or equal 0'
            validationUpdate={updateValidation('altitude')} />
        </Grid>
        <Grid container size={12} justifyContent="space-between">
          <Grid>
            {profileUpdated && <Alert severity="success">Profile updatd</Alert>}
          </Grid>
          <Grid>
            <Button variant="contained" size="small"
              disabled={!isValid()}
              // loading={loading}
              onClick={handleProfileSave}
            >Save {isValid()}</Button>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
}
