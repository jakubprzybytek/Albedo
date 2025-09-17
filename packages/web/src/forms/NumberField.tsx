import { useState, type JSX, type Dispatch, type SetStateAction } from "react";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";

type NumberFieldParams = {
  disabled: boolean;
  label: string;
  startAdornment?: string;
  value: number;
  onChange: Dispatch<SetStateAction<number>>;
  validationUpdate: (valid: boolean) => void;
};

export default function NumberField({ label, value, onChange, disabled, startAdornment, validationUpdate }: NumberFieldParams): JSX.Element {
  const [valueString, setValueString] = useState(value.toString());
  const [error, setError] = useState(false);

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const value = event.target.value;
    setValueString(value);

    const isError = !value || isNaN(Number(value));
    setError(isError);
    validationUpdate(!isError);

    if (!isError) {
      onChange(Number(value));
    }
  }

  return (
    <TextField label={label} size="small"
      slotProps={{
        input: { startAdornment: startAdornment ? <InputAdornment position="start">{startAdornment}</InputAdornment> : null },
      }}
      disabled={disabled}
      error={error}
      helperText={error ? "Please enter a valid number" : undefined}
      value={valueString}
      onChange={handleChange}
    />
  );
}
