import type { JSX } from 'react';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Angle from '@/common/Angle';
import BodyChip from '@/common/BodyChip';
import type { DsoConjunction, OpenNgcObject } from '@/sdk/Conjunctions';
import DsoConjunctionDrawing from '@/components/DsoConjunctions/DsoConjunctionDrawing';
import { formatDegrees } from '@/utils';
import DsoChip from '@/common/DsoChip';
import AstronomicalCoords from '@/common/AstronomicalCoordinates';
import { AstronomicalCoordinates } from '@astro/coords';

type DsoSizeParamType = {
  dso: OpenNgcObject;
}

function DsoSize({ dso }: DsoSizeParamType) {
  if (dso.majorAxis) {
    if (dso.minorAxis) {
      return (<><Angle value={dso.majorAxis} /> / <Angle value={dso.minorAxis} /> / {dso.positionAngle}°</>);
    } else {
      return (<><Angle value={dso.majorAxis} /></>);
    }
  } else {
    return (<>?</>);
  }
}

type ConjunctionEventParamType = {
  conjunction: DsoConjunction;
  expanded: boolean;
}

export default function DsoConjunctionEvent({ conjunction, expanded }: ConjunctionEventParamType): JSX.Element {
  return (
    <>
      <Typography variant="subtitle2">
        <>{new Date(conjunction.tde).toLocaleString('pl-pl')} CET/CEST</>
      </Typography>
      <Stack className='event-card-content' direction={expanded ? 'column' : 'row'} spacing={1}>
        <Box display='flex' justifyContent='center' alignItems='center' height={expanded ? '30vh' : '80px'}>
          <DsoConjunctionDrawing conjunction={conjunction} />
        </Box>
        <Stack>
          <Typography marginBottom={1}>
            <>Conjunction between <BodyChip bodyId={conjunction.body.info.id} /> and <DsoChip dso={conjunction.dso} /> with
              a sepration of <Angle value={conjunction.separation} /> and
              sep. factor of {conjunction.separationFactor}.</>
          </Typography>
          <Box sx={{ display: expanded ? 'block' : 'none' }}>
            <Typography>Coordinates:</Typography>
            <Typography variant='body2'>
              <BodyChip bodyId={conjunction.body.info.id} />: <AstronomicalCoords coords={conjunction.body.ephemeris.coords} />
            </Typography>
            <Typography variant='body2'>
              {conjunction.dso.name}: <AstronomicalCoords coords={new AstronomicalCoordinates(conjunction.dso.rightAscension, conjunction.dso.declination)} />
            </Typography>
            <Typography>Sizes:</Typography>
            <Typography variant='body2'>
              <BodyChip bodyId={conjunction.body.info.id} />: <Angle value={conjunction.body.ephemeris.angularSize} />
            </Typography>
            <Typography variant='body2'>
              {conjunction.dso.name}: <DsoSize dso={conjunction.dso} />
            </Typography>
          </Box>
        </Stack>
      </Stack>
    </>
  );
}
