import type { JSX } from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import DateAxisTick from '@/common/charts/DateAxisTick';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts';
import type { DetailedEphemeris } from '@/sdk/GetEphemerides';

type AngularSizeChartPropsType = {
  ephemeris: DetailedEphemeris[];
}

export default function AngularSizeChart({ ephemeris }: AngularSizeChartPropsType): JSX.Element {
  const theme = useTheme();

  return (
    <Box sx={{ aspectRatio: { xs: '1', sm: '2' }, maxHeight: '70vh' }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={ephemeris}>
          <XAxis dataKey="tde" tick={<DateAxisTick />} />
          <YAxis width={30} />
          <Tooltip />
          <Line type="monotone" dataKey="angularSizeDeg" stroke="#8884d8" />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
}
