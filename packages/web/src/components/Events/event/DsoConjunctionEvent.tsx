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
            <Typography variant='h6'>Coordinates</Typography>
            <Stack direction='row' justifyContent='space-between' spacing={1} textAlign='right'>
              <Typography><BodyChip bodyId={conjunction.body.info.id} /></Typography>
              <Typography><AstronomicalCoords coords={conjunction.body.ephemeris.coords} /></Typography>
            </Stack>
            <Stack direction='row' justifyContent='space-between' spacing={1} textAlign='right'>
              <Typography>{conjunction.dso.name}</Typography>
              <Typography><AstronomicalCoords coords={new AstronomicalCoordinates(conjunction.dso.rightAscension, conjunction.dso.declination)} /></Typography>
            </Stack>
            <Typography variant='h6'>Angular size</Typography>
            <Stack direction='row' justifyContent='space-between'>
              <Typography><BodyChip bodyId={conjunction.body.info.id} /></Typography>
              <Typography><Angle value={conjunction.body.ephemeris.angularSize} /></Typography>
            </Stack>
            <Stack direction='row' justifyContent='space-between'>
              <Typography>{conjunction.dso.name}</Typography>
              <Typography><DsoSize dso={conjunction.dso} /></Typography>
            </Stack>
          </Box>
        </Stack>
      </Stack>
    </>
  );
}
