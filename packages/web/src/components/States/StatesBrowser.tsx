import { useState, type JSX } from "react";
import StatesQueryForm from './StatesQueryForm';
import StatesTable from './StatesTable';
import useQuery from "@/forms/useQuery";
import getStates, { type StatesQuery, type StateWithPositionAndVelocity } from "@/sdk/States";
import { Stack } from "@mui/material";

export default function StatesBrowser(): JSX.Element {
  const [states, setStates] = useState<StateWithPositionAndVelocity[]>([]);
  const query = useQuery<StatesQuery, StateWithPositionAndVelocity[]>(fetchData, setStates);

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