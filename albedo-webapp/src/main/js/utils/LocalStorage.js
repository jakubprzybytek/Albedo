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