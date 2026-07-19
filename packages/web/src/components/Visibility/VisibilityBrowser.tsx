import { useState, type JSX } from 'react';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import { iterateVisibilityPages, type VisibilityQuery, type VisibilityResponse } from '@/sdk/Visibility';
import VisibilityChart from './VisibilityChart';
import VisibilityQueryForm from './VisibilityQueryForm';

export default function VisibilityBrowser(): JSX.Element {
  const [result, setResult] = useState<VisibilityResponse>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();
  const [generation, setGeneration] = useState(0);
  async function submit(query: VisibilityQuery) {
    const requestGeneration = generation + 1;
    setGeneration(requestGeneration); setLoading(true); setError(undefined); setResult(undefined);
    try {
      for await (const page of iterateVisibilityPages(query)) {
        if (requestGeneration !== generation + 1) return;
        setResult(previous => previous ? { ...page, days: [...previous.days, ...page.days] } : page);
      }
    } catch (reason) { if (requestGeneration === generation + 1) setError(reason instanceof Error ? reason.message : String(reason)); }
    finally { if (requestGeneration === generation + 1) setLoading(false); }
  }
  return <Stack spacing={2} padding={1}><VisibilityQueryForm loading={loading} error={error} onSubmit={submit} />
    {loading && result && <Alert severity="info">Loading more dates: {result.days.length} loaded.</Alert>}
    {result && <VisibilityChart days={result.days} timeZone={result.timeZone} />}
  </Stack>;
}