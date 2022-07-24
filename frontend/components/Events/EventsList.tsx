import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { Conjunction } from '@lambda/conjunctions';
import { formatDegrees } from '../../utils';
import BodyChip from 'common/BodyChip';

type ConjunctionEventParamTyp = {
    conjunction: Conjunction;
}

function ConjunctionEvent({ conjunction }: ConjunctionEventParamTyp): JSX.Element {
    return (
        <Typography key={conjunction.jde} sx={{ padding: 1 }}>
            Conjunction between <BodyChip body={conjunction.firstBody.info} /> and <BodyChip body={conjunction.secondBody.info} /> with a sepration of {formatDegrees(conjunction.separation)}.
        </Typography>
    );
}

type EventsListPropsType = {
    events: any[];
}

export default function EventsList({ events }: EventsListPropsType): JSX.Element {
    return (
        <Box>
            {events.map((event) => (
                <Paper key={event.jde} sx={{ marginBottom: 1 }}>
                    <ConjunctionEvent conjunction={event as Conjunction} />
                </Paper>
            ))}
        </Box>
    );
}
