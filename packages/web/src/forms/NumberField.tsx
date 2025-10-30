import { useState, type JSX, type Dispatch, type SetStateAction } from "react";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";

type NumberFieldParams = {
  disabled?: boolean;
  label: string;
  startAdornment?: string;
  value: number;
  validateValue?: (value: number) => boolean,
  validationErrorMessage?: string,
  onChange: (value: number) => void;
  validationUpdate: (valid: boolean) => void;
};

export default function NumberField({ disabled = false, label, startAdornment, value, validateValue, validationErrorMessage, onChange, validationUpdate }: NumberFieldParams): JSX.Element {
  const [valueString, setValueString] = useState(value.toString());
  const [error, setError] = useState(false);

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const stringValue = event.target.value;
    setValueString(stringValue);

    const value = Number(stringValue);
    let isError = !stringValue || isNaN(value) || (validateValue ? !validateValue(value) : false);

    setError(isError);
    validationUpdate(!isError);

    if (!isError) {
      onChange(Number(stringValue));
    }
  }

  return (
    <TextField label={label} size="small"
      slotProps={{
        input: { startAdornment: startAdornment ? <InputAdornment position="start">{startAdornment}</InputAdornment> : null },
      }}
      disabled={disabled}
      error={error}
      helperText={error ? validationErrorMessage || "Please enter a valid number" : undefined}
      value={valueString}
      onChange={handleChange}
    />
  );
}
