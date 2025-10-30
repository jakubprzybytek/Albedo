import { useEffect, useState, type Dispatch, type JSX } from "react";
import Grid from '@mui/material/Grid';
import NumberField from "@/forms/NumberField";
import type { Location } from "@/common/Profile";

type ObserverLocationFieldsParams = {
  disabled: boolean;
  onChanged: (updatedObserverLocation: Location) => void;
  updateValidation: (field: string) => (valid: boolean) => void;
};

export default function ObserverLocationFields({ onChanged, updateValidation, disabled }: ObserverLocationFieldsParams): JSX.Element {
  const [latitude, setLatitude] = useState(51);
  const [longitude, setLongitude] = useState(17);
  const [altitude, setAltitude] = useState(50);

  useEffect(() => {
    onChanged({
      latitude,
      longitude,
      altitude
    });
  }, [latitude, longitude, altitude]);

  return (
    <>
      <Grid size={{ xs: 4, sm: 3 }}>
        <NumberField label="Latitude (N)" startAdornment="°"
          disabled={disabled}
          validateValue={(value: number) => value >= -90 && value <= 90}
          validationErrorMessage='Provide number between -90 and 90'
          validationUpdate={updateValidation('latitude')}
          value={latitude} onChange={setLatitude}
        />
      </Grid>
      <Grid size={{ xs: 4, sm: 3 }}>
        <NumberField label="Longitude (E)" startAdornment="°"
          disabled={disabled}
          validateValue={(value: number) => value >= -180 && value <= 180}
          validationErrorMessage='Provide number between -180 and 180'
          validationUpdate={updateValidation('longitude')}
          value={longitude} onChange={setLongitude}
        />
      </Grid>
      <Grid size={{ xs: 4, sm: 3 }}>
        <NumberField label="Altitude" startAdornment="m"
          disabled={disabled}
          validateValue={(value: number) => value >= 0}
          validationErrorMessage='Provide number greater than or equal 0'
          validationUpdate={updateValidation('altitude')}
          value={altitude} onChange={setAltitude}
        />
      </Grid>
    </>
  );
}
