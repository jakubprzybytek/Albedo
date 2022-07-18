import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts';
import { format } from 'date-fns';
import { Separation } from '@lambda/separations';
import { formatHourAngle, formatDegrees } from '../Utils';

type DateAxisTickPropsType = {
    x: number;
    y: number;
    stroke: number;
    payload: any;
}

function DateAxisTick(props: any): JSX.Element {
    const { x, y, stroke, payload } = props as DateAxisTickPropsType;

    if (payload.value === 0 || payload.value === 'auto') {
        return (<></>);
    }

    return (
        <g transform={`translate(${x},${y})`}>
            <text x={0} y={0} dy={16} textAnchor="end" fill="#666">
                {format(Date.parse(payload.value), 'yyyy-MM-dd')}
            </text>
        </g>
    );
}

type SeparationsChartPropsType = {
    separations: Separation[];
}

export default function SeparationsChart({ separations }: SeparationsChartPropsType): JSX.Element {
    const theme = useTheme();

    return (
        <Box sx={{ aspectRatio: { xs: '1', sm: '2' } }}>
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={separations}>
                    <XAxis dataKey="tde" tick={<DateAxisTick />} />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="separation" stroke="#8884d8" />
                </LineChart>
            </ResponsiveContainer>
        </Box>
    );
}
