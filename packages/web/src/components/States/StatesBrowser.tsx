import { useState, type JSX } from "react";
import { Stack } from "@mui/material";
import StatesQueryForm from './StatesQueryForm';
import StatesTable from './StatesTable';
import useQuery from "@/forms/useQuery";
import getStates, { type StatesQuery, type StateResult } from "@/sdk/States";

export default function StatesBrowser(): JSX.Element {
  const [states, setStates] = useState<StateResult[]>([]);
  const query = useQuery<StatesQuery, StateResult[]>(fetchData, setStates);

  async function fetchData(params: StatesQuery) {
    return await getStates(params);
  }

  return (
    <Stack spacing={1} padding={1}>
      <StatesQueryForm query={query} />
      <StatesTable states={states} />
    </Stack>
  );
}