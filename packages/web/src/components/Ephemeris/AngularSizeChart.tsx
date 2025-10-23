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
  active: boolean;
  payload: any[];
  label: string;
}

const CustomTooltip = ({ active, payload, label }: TooltipProps) => {
  const isVisible = active && payload && payload.length;
  return (
    <Card>
      {isVisible && (
        <CardContent sx={{ bp: 0 }}>
          {/* <Typography gutterBottom>{format(label, 'yyyy-MM-dd HH:mm:ss')}</Typography> */}
          <Typography gutterBottom>{label}</Typography>
          <Typography color={payload[0].color}>{payload[0].name}: {formatDegrees(payload[0].value)}</Typography>
          {/* <Typography>{JSON.stringify(payload)}</Typography> */}
        </CardContent>
      )}
    </Card>
  );
};

type AngularSizeChartPropsType = {
  ephemeris: DetailedEphemeris[];
}

export default function AngularSizeChart({ ephemeris }: AngularSizeChartPropsType): JSX.Element {
  const theme = useTheme();

  return (
    <Box sx={{ aspectRatio: { xs: '1', sm: '2' }, maxHeight: '70vh' }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={ephemeris} margin={{ left: 30 }}>
          <XAxis dataKey="tde" tick={<DateAxisTick />} />
          <YAxis width={30} />
          <Tooltip content={<CustomTooltip />} />
          <Line type="monotone" name="Angular Size" dataKey="angularSizeDeg" stroke="#8884d8" />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
}
