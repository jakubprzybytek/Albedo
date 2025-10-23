import type { JSX } from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import DateAxisTick from '@/common/charts/DateAxisTick';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts';
import type { Separation } from '@/sdk/Separations';

type SeparationsChartPropsType = {
  separations: Separation[];
}

export default function SeparationsChart({ separations }: SeparationsChartPropsType): JSX.Element {
  const theme = useTheme();

  return (
    <Box sx={{ aspectRatio: { xs: '1', sm: '2' }, maxHeight: '70vh' }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={separations}>
          <XAxis dataKey="tde" tick={<DateAxisTick />} />
          <YAxis width={30} />
          <Tooltip />
          <Line type="monotone" dataKey="separation" stroke="#8884d8" />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
}
