import React from 'react';
import AsteroidConjunctionsForm from './AsteroidConjunctionsForm';
import AsteroidConjunctionsTable from './AsteroidConjunctionsTable';

export default function AsteroidConjunctionsPanel() {

  const [rows, setRows] = React.useState([]);

  return (
    <div>
      <AsteroidConjunctionsForm updateRows={setRows} />
      <AsteroidConjunctionsTable rows={rows} />
    </div>
  );
}
