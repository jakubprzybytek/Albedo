import Typography from '@mui/material/Typography';
import { formatDegrees } from '../utils';

type AngleParamType = {
    value: number;
}

export default function Angle({ value }: AngleParamType): JSX.Element {
    return (
        <Typography component='span' sx={{
            backgroundColor: 'whitesmoke',
            border: '1px solid darkgrey',
            borderRadius: 2,
            padding: '1px 4px',
            whiteSpace: 'nowrap'
        }}>
            {formatDegrees(value)}
        </Typography>
    );
}