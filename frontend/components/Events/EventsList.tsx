import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { Conjunction } from '@lambda/conjunctions';
import Angle from 'common/Angle';
import BodyChip from 'common/BodyChip';

type ConjunctionEventParamTyp = {
    conjunction: Conjunction;
}

function ConjunctionEvent({ conjunction }: ConjunctionEventParamTyp): JSX.Element {
    return (
        <>
            <Typography variant="subtitle2" sx={{ padding: 1 }}>
                <>{new Date(conjunction.tde).toLocaleString('pl-pl')}</>
            </Typography>
            <Typography sx={{ pb: 1, pr: 1, pl: 1 }}>
                <>Conjunction between <BodyChip body={conjunction.firstBody.info} /> and <BodyChip body={conjunction.secondBody.info} /> with a sepration of <Angle value={conjunction.separation} />.</>
            </Typography>
        </>
    );
}

type EventsListPropsType = {
    events: any[];
}

export default function EventsList({ events }: EventsListPropsType): JSX.Element {
    const theme = useTheme();

    return (
        <Box>
            {events.map((event) => (
                <Paper key={event.jde} sx={{ marginBottom: 1, backgroundColor: theme.palette.secondaryBackground }}>
                    <ConjunctionEvent conjunction={event as Conjunction} />
                </Paper>
            ))}
        </Box>
    );
}
