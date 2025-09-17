import { useState } from "react";

export function useValidation() {
  const [validationErrors, setValidationErrors] = useState(new Set<string>());

  function updateValidation(fieldName: string) {
    return (valid: boolean) => {
      if (valid) {
        const newValidationErrors = new Set(validationErrors);
        newValidationErrors.delete(fieldName);
        setValidationErrors(newValidationErrors);
      } else {
        const newValidationErrors = new Set(validationErrors);
        newValidationErrors.add(fieldName);
        setValidationErrors(newValidationErrors);
      }
    }
  }

  function isValid(): boolean {
    return validationErrors.size === 0;
  }

  return {
    updateValidation,
    isValid,
  }
}
