import React from 'react';

export const useStateWithLocalStorageInt = (localStorageKey, defaultValue) => {
    const [value, setValue] = React.useState(
      parseInt(localStorage.getItem(localStorageKey) || defaultValue)
    );
   
    React.useEffect(() => {
      localStorage.setItem(localStorageKey, value);
    }, [value]);
   
    return [value, setValue];
  };

export function localStorageVariable(localStorageKey, defaultValue) {

  const storedValue = localStorage.getItem(localStorageKey);
  const initialValue = (storedValue && JSON.parse(storedValue)) || defaultValue;

  const updateValue = (value) => {
    localStorage.setItem(localStorageKey, JSON.stringify(value));
    return value;  
  }

  return [initialValue, updateValue];
}
