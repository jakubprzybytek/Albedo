import type { JSX } from "react";
import Grid from '@mui/material/Grid';
import NumberField from "@/forms/NumberField";
import type { Location } from "@/common/Profile";

type ObserverLocationFieldsParams = {
  disabled?: boolean;
  location: Location;
  onChanged: (updatedObserverLocation: Location) => void;
  updateValidation: (field: string) => (valid: boolean) => void;
};

export default function ObserverLocationFields({ onChanged, updateValidation, disabled = false, location }: ObserverLocationFieldsParams): JSX.Element {
  const handleLatitudeChange = (latitude: number) => {
    onChanged({ ...location, latitude });
  };

  const handleLongitudeChange = (longitude: number) => {
    onChanged({ ...location, longitude });
  };

  const handleAltitudeChange = (altitude: number) => {
    onChanged({ ...location, altitude });
  };

  return (
    <>
      <Grid size={{ xs: 4, sm: 3 }}>
        <NumberField label="Latitude (N)" startAdornment="°"
          disabled={disabled}
          validateValue={(value: number) => value >= -90 && value <= 90}
          validationErrorMessage='Provide number between -90 and 90'
          validationUpdate={updateValidation('latitude')}
          value={location.latitude} onChange={handleLatitudeChange}
        />
      </Grid>
      <Grid size={{ xs: 4, sm: 3 }}>
        <NumberField label="Longitude (E)" startAdornment="°"
          disabled={disabled}
          validateValue={(value: number) => value >= -180 && value <= 180}
          validationErrorMessage='Provide number between -180 and 180'
          validationUpdate={updateValidation('longitude')}
          value={location.longitude} onChange={handleLongitudeChange}
        />
      </Grid>
      <Grid size={{ xs: 4, sm: 3 }}>
        <NumberField label="Altitude" startAdornment="m"
          disabled={disabled}
          validateValue={(value: number) => value >= 0}
          validationErrorMessage='Provide number greater than or equal 0'
          validationUpdate={updateValidation('altitude')}
          value={location.altitude} onChange={handleAltitudeChange}
        />
      </Grid>
    </>
  );
}
