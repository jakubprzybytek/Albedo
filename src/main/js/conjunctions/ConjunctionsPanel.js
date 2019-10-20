import React from 'react';
import ConjunctionsForm from './ConjunctionsForm';
import ConjunctionsTable from './ConjunctionsTable';

export default function ConjunctionsPanel() {

  const [rows, setRows] = React.useState([]);

  return (
    <div>
      <ConjunctionsForm updateRows={setRows} />
      <ConjunctionsTable rows={rows} />
    </div>
  );
}
