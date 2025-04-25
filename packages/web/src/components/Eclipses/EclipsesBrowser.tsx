import { useState, type JSX } from "react";
import Stack from "@mui/material/Stack";
import EclipsesQueryForm from './EclipsesQueryForm';
import EclipsesTable from './EclipsesTable';
import type { Eclipse, EclipsesQuery } from "@/sdk/Eclipses";
import useQuery from "@/forms/useQuery";
import getEclipses from "@/sdk/Eclipses";

export default function EclipsesBrowser(): JSX.Element {
  const [eclipses, setEclipses] = useState<Eclipse[]>([]);
  const query = useQuery<EclipsesQuery, Eclipse[]>(fetchData, setEclipses);

  async function fetchData(params: EclipsesQuery) {
    return await getEclipses(params);
  }

  return (
    <Stack spacing={1} padding={1}>
      <EclipsesQueryForm query={query} />
      <EclipsesTable eclipses={eclipses} />
    </Stack>
  );
}
