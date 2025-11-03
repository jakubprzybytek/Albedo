import type { JSX } from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import DateAxisTick from '@/common/charts/DateAxisTick';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts';
import { formatDegrees } from '@/utils';
import type { DetailedEphemeris } from '@/sdk/Ephemerides';

type TooltipProps = {
  active?: boolean;
  payload?: any[];
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: TooltipProps) => {
  const isVisible = active && payload && payload.length;
  return (
    <Card>
      {isVisible && (
        <CardContent sx={{ bp: 0 }}>
          {/* <Typography gutterBottom>{format(label, 'yyyy-MM-dd HH:mm:ss')}</Typography> */}
          <Typography gutterBottom>{label}</Typography>
          {payload.map((entry, index) => {
            // Format angular size in arc minutes, others in degrees
            const formattedValue = entry.name === 'Angular Size' 
              ? `${entry.value.toFixed(2)}'`
              : formatDegrees(entry.value);
            return (
              <Typography key={index} color={entry.color}>
                {entry.name}: {formattedValue}
              </Typography>
            );
          })}
          {/* <Typography>{JSON.stringify(payload)}</Typography> */}
        </CardContent>
      )}
    </Card>
  );
};

type EphemerisChartsPropsType = {
  ephemeris: DetailedEphemeris[];
}

export default function EphemerisCharts({ ephemeris }: EphemerisChartsPropsType): JSX.Element {
  const theme = useTheme();

  // Transform data to convert angular size from degrees to arc minutes
  const chartData = ephemeris.map(item => ({
    ...item,
    angularSizeArcMin: item.angularSize * 60
  }));

  return (
    <Box sx={{ aspectRatio: { xs: '1', sm: '2' }, maxHeight: '70vh' }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ left: 30, right: 30 }}>
          <XAxis dataKey="tde" tick={DateAxisTick} />
          <YAxis yAxisId="left" width={30} label={{ value: "Angular Size (')", angle: -90, position: 'insideLeft' }} />
          <YAxis yAxisId="right" orientation="right" width={30} label={{ value: 'Declination (°)', angle: 90, position: 'insideRight' }} />
          <Tooltip content={<CustomTooltip />} />
          <Line yAxisId="left" type="monotone" name="Angular Size" dataKey="angularSizeArcMin" stroke="#8884d8" />
          <Line yAxisId="right" type="monotone" name="Declination" dataKey="coords.declination" stroke="#82ca9d" />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
}
