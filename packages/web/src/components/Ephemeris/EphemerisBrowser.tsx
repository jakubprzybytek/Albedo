import { useState, type JSX } from "react";
import Stack from "@mui/material/Stack";
import EphemerisQueryForm from './EphemerisQueryForm';
import EphemerisTable from './EphemerisTable';
import useQuery from "@/forms/useQuery";
import getEphemerides, { type EphemeridesQuery, type Ephemeris } from "@/sdk/GetEphemerides";

export default function StatesBrowser(): JSX.Element {
  const [ephemerides, setEphemerides] = useState<Ephemeris[]>([]);
  const query = useQuery<EphemeridesQuery, Ephemeris[]>(fetchData, setEphemerides);

  async function fetchData(params: EphemeridesQuery) {
    return await getEphemerides(params);
  }

  return (
    <Stack spacing={1} padding={1}>
      <EphemerisQueryForm query={query} />
      <EphemerisTable ephemerides={ephemerides} />
    </Stack>
  );
}
