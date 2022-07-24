import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Conjunction } from '@lambda/conjunctions';
import { formatDegrees } from '../../utils';
import AstronomicalCoords from 'common/AstronomicalCoordinates';
import BodyChip from 'common/BodyChip';

type EventsListPropsType = {
    events: any;
}

export default function EventsList({ events }: EventsListPropsType): JSX.Element {
    return (
        <span>events</span>
    );
}
