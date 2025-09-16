import { useState, type JSX, type Dispatch, type SetStateAction } from "react";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";

type NumberFieldParams = {
  label: string;
  value: number;
  onChange: Dispatch<SetStateAction<number>>;
  disabled: boolean;
  startAdornment?: string;
};

export default function NumberField({ label, value, onChange, disabled, startAdornment }: NumberFieldParams): JSX.Element {
  const [valueString, setValueString] = useState(value.toString());
  const [error, setError] = useState(false);

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const value = event.target.value;
    setValueString(value);

    const isError = !value || isNaN(Number(value));
    setError(isError);

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
      value={valueString}
      onChange={handleChange}
    />
  );
}
