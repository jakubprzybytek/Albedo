import type { JSX } from 'react';
import { useState } from 'react';
import { useTheme } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import Typography from '@mui/material/Typography';
import { useValidation } from '@/forms';
import { useProfile } from './useProfile';
import ObserverLocationFields from '@/components/commons/ObserverLocationFields';
import type { Location } from '@/common/Profile';

export default function ProfileDialog(): JSX.Element {
  const [profile, updateProfile] = useProfile();

  const [location, setLocation] = useState<Location>(profile.location);

  const [profileUpdated, setProfileUpdated] = useState(false);

  const { updateValidation, isValid } = useValidation();

  function handleProfileSave() {
    updateProfile({
      location
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
        <ObserverLocationFields
          disabled={false}
          location={location}
          onChanged={setLocation}
          updateValidation={updateValidation}
        />
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
