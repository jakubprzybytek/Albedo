import { useState, type JSX } from "react";
import Stack from "@mui/material/Stack";
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import TabPanel from "@/common/tabs/TabPanel";
import SeparationsQueryForm from './SeparationsQueryForm';
import SeparationsTable from './SeparationsTable';
import SeparationsChart from "./SeparationsChart";
import type { SeparationsQuery, Separation } from "@/sdk/Separations";
import useQuery from "@/forms/useQuery";
import getSeparations from "@/sdk/Separations";

export default function SeparationsBrowser(): JSX.Element {
  const [openedTab, setOpenedTab] = useState(0);

  const [separations, setSeparations] = useState<Separation[]>([]);
  const query = useQuery<SeparationsQuery, Separation[]>(fetchData, setSeparations);

  async function fetchData(params: SeparationsQuery) {
    return await getSeparations(params);
  }

  return (
    <Stack spacing={1} padding={1}>
      <SeparationsQueryForm query={query} />
      <Box sx={{ width: 'auto' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={openedTab} onChange={(event, newValue) => setOpenedTab(newValue)}>
            <Tab label="Table" />
            <Tab label="Chart" />
          </Tabs>
        </Box>
        <TabPanel value={openedTab} index={0}>
          <SeparationsTable separations={separations} />
        </TabPanel>
        <TabPanel value={openedTab} index={1}>
          <SeparationsChart separations={separations} />
        </TabPanel>
      </Box>
    </Stack>
  );
}