import { useState, type JSX } from "react";
import Stack from "@mui/material/Stack";
import ConjunctionsQueryForm from './ConjunctionsQueryForm';
import ConjunctionsTable from './ConjunctionsTable';
import type { Conjunction, ConjunctionsQuery } from "@/sdk/Conjunctions";
import useQuery from "@/forms/useQuery";
import { getConjunctions } from "@/sdk/Conjunctions";

export default function ConjunctionsBrowser(): JSX.Element {
  const [conjunctions, setConjunctions] = useState<Conjunction[]>([]);
  const query = useQuery<ConjunctionsQuery, Conjunction[]>(fetchData, setConjunctions);

  async function fetchData(params: ConjunctionsQuery) {
    return await getConjunctions(params);
  }

  return (
    <Stack spacing={1} padding={1}>
      <ConjunctionsQueryForm query={query} />
      <ConjunctionsTable conjunctions={conjunctions} />
    </Stack>
  );
}