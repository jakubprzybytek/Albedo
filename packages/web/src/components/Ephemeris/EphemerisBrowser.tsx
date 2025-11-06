import { useState, type JSX } from "react";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import TabPanel from "@/common/tabs/TabPanel";
import useQuery from "@/forms/useQuery";
import getEphemerides, { type EphemeridesQuery, type EphemerisWithVelocity } from "@/sdk/Ephemerides";
import { AstronomicalCoordinates } from "@astro/coords";
import EphemerisQueryForm from './EphemerisQueryForm';
import EphemerisTable from './EphemerisTable';
import EphemerisCharts from "./EphemerisCharts";

const SECONDS_PER_DAY = 86400;

export type EphemerisWithAdjustedVelocity = EphemerisWithVelocity & {
  velocityPerInterval: AstronomicalCoordinates;
};

export default function StatesBrowser(): JSX.Element {
  const [openedTab, setOpenedTab] = useState(0);

  const [ephemerides, setEphemerides] = useState<EphemerisWithAdjustedVelocity[]>([]);
  const query = useQuery<EphemeridesQuery, EphemerisWithAdjustedVelocity[]>(fetchData, setEphemerides);

  async function fetchData(params: EphemeridesQuery) {
    const rawData = await getEphemerides(params);
    
    // Enrich data with velocity adjusted to the interval
    // Raw velocity is in degrees per second, interval is in days
    const secondsPerInterval = params.interval * SECONDS_PER_DAY;
    
    return rawData.map(item => ({
      ...item,
      velocityPerInterval: new AstronomicalCoordinates(
        item.velocity.rightAscension * secondsPerInterval,
        item.velocity.declination * secondsPerInterval
      )
    }));
  }

  return (
    <Stack spacing={1} padding={1}>
      <EphemerisQueryForm query={query} />
      <Box sx={{ width: 'auto' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={openedTab} onChange={(event, newValue) => setOpenedTab(newValue)}>
            <Tab label="Table" />
            <Tab label="Charts" />
          </Tabs>
        </Box>
        <TabPanel value={openedTab} index={0}>
          <EphemerisTable ephemerides={ephemerides} />
        </TabPanel>
        <TabPanel value={openedTab} index={1}>
          <EphemerisCharts ephemeris={ephemerides} />
        </TabPanel>
      </Box>
    </Stack>
  );
}
