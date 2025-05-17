import type { JSX } from 'react';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { SunIcon, MoonIcon, PlanetIcon } from './AstronomicalIcons';
import type { JplBody } from '@lambda';
import { JplBodyId, BodyType, jplBodyFromId } from '@jpl';

type AstroIconType = {
  body: JplBody;
}

function AstroIcon({ body }: AstroIconType): JSX.Element {
  if (body.id === JplBodyId.Sun) {
    return (
      <SunIcon width={18} height={18} />
    )
  } else if (body.id === JplBodyId.Moon) {
    return (
      <MoonIcon width={18} height={18} />
    )
  } else if (body.type === BodyType.Planet) {
    return (
      <PlanetIcon name={body.name} width={18} height={18} />
    )
  }

  return (
    <>(?)</>
  )
}


type BodyChipParamType = {
  bodyId: JplBodyId;
}

export default function BodyChip({ bodyId }: BodyChipParamType): JSX.Element {
  const body = jplBodyFromId(bodyId);

  if (body === undefined) {
    return (
      <>(!)</>
    )
  }

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
        <AstroIcon body={body} />
      </Avatar>
      <Typography component='span' fontWeight={600}>{body.name}</Typography>
    </Typography>
  );
}
