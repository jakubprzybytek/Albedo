import { useState, type JSX } from "react";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import TabPanel from "@/common/tabs/TabPanel";
import useQuery from "@/forms/useQuery";
import getEphemerides, { type EphemeridesQuery, type DetailedEphemeris } from "@/sdk/Ephemerides";
import EphemerisQueryForm from './EphemerisQueryForm';
import EphemerisTable from './EphemerisTable';
import AngularSizeChart from "./AngularSizeChart";

export default function StatesBrowser(): JSX.Element {
  const [openedTab, setOpenedTab] = useState(0);

  const [ephemerides, setEphemerides] = useState<DetailedEphemeris[]>([]);
  const query = useQuery<EphemeridesQuery, DetailedEphemeris[]>(fetchData, setEphemerides);

  async function fetchData(params: EphemeridesQuery) {
    return await getEphemerides(params);
  }

  return (
    <Stack spacing={1} padding={1}>
      <EphemerisQueryForm query={query} />
      <Box sx={{ width: 'auto' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={openedTab} onChange={(event, newValue) => setOpenedTab(newValue)}>
            <Tab label="Table" />
            <Tab label="Chart" />
          </Tabs>
        </Box>
        <TabPanel value={openedTab} index={0}>
          <EphemerisTable ephemerides={ephemerides} />
        </TabPanel>
        <TabPanel value={openedTab} index={1}>
          <AngularSizeChart ephemeris={ephemerides} />
        </TabPanel>
      </Box>
    </Stack>
  );
}
