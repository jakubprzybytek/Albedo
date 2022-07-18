import { useState } from "react";
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import SeparationsQueryForm from './SeparationsQueryForm';
import SeparationsTable from './SeparationsTable';
import SeparationsChart from "./SeparationsChart";
import { Separation } from '@lambda/separations';

interface TabPanelProps {
    index: number;
    value: number;
    children?: React.ReactNode;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index } = props;

    return (
        <div hidden={value !== index}>
            {value === index && (<>
                {children}
            </>)}
        </div>
    );
}

export default function SeparationsBrowser(): JSX.Element {
    const [openedTab, setOpenedTab] = useState(0);

    const [separations, setSeparations] = useState<Separation[]>([]);

    return (
        <Box sx={{ '& > div': { mb: 1 } }}>
            <div>
                <SeparationsQueryForm setSeparations={setSeparations} />
            </div>
            <Box sx={{ width: '100%' }}>
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
        </Box>
    );
}