import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { PlanetIcon } from './AstronomicalIcons';
import { JplBody } from '@lambda';

type BodyChipParamType = {
    body: JplBody;
}

export default function BodyChip({ body }: BodyChipParamType): JSX.Element {
    return (
        <Box component='span' sx={{ display: 'flex' }}>
            <Avatar component='span' sx={{ height: 18, width: 18, fontSize: '0.7rem', marginTop: '2px', marginRight: 0.5, background: 'red' }}>
                <PlanetIcon name={body.name} width={14} height={14} />
            </Avatar>
            <Typography component='span' fontWeight={600}>{body.name}</Typography>
        </Box>
    );
}