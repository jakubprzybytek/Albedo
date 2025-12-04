import { useState, type JSX } from "react";
import Stack from "@mui/material/Stack";
import DsoConjunctionsQueryForm from './DsoConjunctionsQueryForm';
import DsoConjunctionsTable from './DsoConjunctionsTable';
import type { Conjunction, ConjunctionsQuery, DsoConjunction } from "@/sdk/Conjunctions";
import useQuery from "@/forms/useQuery";
import { getDsoConjunctions } from "@/sdk/Conjunctions";

export default function DsoConjunctionsBrowser(): JSX.Element {
  const [conjunctions, setConjunctions] = useState<DsoConjunction[]>([]);
  const query = useQuery<ConjunctionsQuery, DsoConjunction[]>(fetchData, setConjunctions);

  async function fetchData(params: ConjunctionsQuery) {
    return await getDsoConjunctions(params);
  }

  return (
    <Stack spacing={1} padding={1}>
      <DsoConjunctionsQueryForm query={query} />
      <DsoConjunctionsTable conjunctions={conjunctions} />
    </Stack>
  );
}