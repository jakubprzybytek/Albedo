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
        <Typography component='span' sx={{ whiteSpace: 'nowrap' }}>
            <Avatar component='span' sx={{
                display: 'inline-block',
                verticalAlign: 'text-bottom',
                height: 18,
                width: 18,
                fontSize: '0.7rem',
                marginRight: 0.5,
                background: 'red'
            }}>
                <PlanetIcon name={body.name} width={18} height={18} />
            </Avatar>
            <Typography component='span' fontWeight={600}>{body.name}</Typography>
        </Typography>
    );
}