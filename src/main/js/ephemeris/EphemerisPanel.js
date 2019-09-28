import React from 'react';
import EphemerisForm from './EphemerisForm';
import EphemerisTable from './EphemerisTable';

export default function EphemerisPanel() {

  const [rows, setRows] = React.useState([]);

  return (
    <div>
      <EphemerisForm updateRows={setRows} />
      <EphemerisTable rows={rows} />
    </div>
  );
}
