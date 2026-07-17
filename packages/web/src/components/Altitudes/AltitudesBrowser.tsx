import { useState, type JSX } from 'react';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import useQuery from '@/forms/useQuery';
import getAltitudes, { type AltitudesQuery, type AltitudesResponse } from '@/sdk/Altitudes';
import AltitudesChart from './AltitudesChart';
import AltitudesQueryForm from './AltitudesQueryForm';

export default function AltitudesBrowser(): JSX.Element {
  const [result, setResult] = useState<AltitudesResponse | undefined>();
  const query = useQuery<AltitudesQuery, AltitudesResponse>(fetchData, setResult);

  async function fetchData(parameters: AltitudesQuery): Promise<AltitudesResponse> {
    setResult(undefined);
    return getAltitudes(parameters);
  }

  return <Stack spacing={2} padding={1}>
    <AltitudesQueryForm query={query} />
    {result?.samples.length === 0 && <Alert severity="info">No altitude samples were returned for this query.</Alert>}
    {result && result.samples.length > 0 && <AltitudesChart result={result} />}
  </Stack>;
}