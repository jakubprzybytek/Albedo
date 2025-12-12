import type { JSX } from 'react';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Angle from '@/common/Angle';
import BodyChip from '@/common/BodyChip';
import type { Eclipse } from '@/sdk/Eclipses';
import { EclipseType } from '@/sdk/Eclipses';
import { JplBodyId } from '@jpl';
import EclipseDrawing from '@/components/Eclipses/EclipseDrawing';
import AstronomicalCoords from '@/common/AstronomicalCoordinates';

type EclipseEventParamType = {
  eclipse: Eclipse;
  expanded: boolean;
}

export default function EclipseEvent({ eclipse, expanded }: EclipseEventParamType): JSX.Element {
  return (
    <>
      <Typography variant="subtitle2">
        <>{new Date(eclipse.tde).toLocaleString('pl-pl')} CET/CEST</>
      </Typography>
      <Stack className='event-card-content' direction={expanded ? 'column' : 'row'} spacing={1}>
        <Box display='flex' justifyContent='center' alignItems='center' height={expanded ? '30vh' : '80px'}>
          <EclipseDrawing eclipse={eclipse} />
        </Box>
        <Stack>
          <Typography marginBottom={1}>
            <BodyChip bodyId={eclipse.type == EclipseType.SunEclipse ? JplBodyId.Sun : JplBodyId.Moon} /> eclipse with a sepration of <Angle value={eclipse.separation} />.
          </Typography>
          <Box sx={{ display: expanded ? 'block' : 'none' }}>
            {eclipse.type == EclipseType.SunEclipse && <>
              <Typography variant='caption'>Coordinates</Typography>
              <Stack direction='row' justifyContent='space-between' spacing={1} textAlign='right'>
                <Typography>Sun</Typography>
                <Typography><AstronomicalCoords coords={eclipse.sunEphemeris.coords} /></Typography>
              </Stack>
              <Stack direction='row' justifyContent='space-between' spacing={1} textAlign='right'>
                <Typography>Moon</Typography>
                <Typography><AstronomicalCoords coords={eclipse.moonEphemeris.coords} /></Typography>
              </Stack>
              <Typography variant='caption'>Angular size</Typography>
              <Stack direction='row' justifyContent='space-between'>
                <Typography>Sun</Typography>
                <Typography><Angle value={eclipse.sunEphemeris.angularSize} /></Typography>
              </Stack>
              <Stack direction='row' justifyContent='space-between'>
                <Typography>Moon</Typography>
                <Typography><Angle value={eclipse.moonEphemeris.angularSize} /></Typography>
              </Stack>
            </>}
            {eclipse.type == EclipseType.MoonEclipse && <>
              <Stack direction='row' justifyContent='space-between' spacing={1} textAlign='right'>
                <Typography>Moon</Typography>
                <Typography><AstronomicalCoords coords={eclipse.moonEphemeris.coords} /></Typography>
              </Stack>
              <Stack direction='row' justifyContent='space-between' spacing={1} textAlign='right'>
                <Typography>Earth shadow</Typography>
                <Typography><AstronomicalCoords coords={eclipse.earthShadowEphemeris.coords} /></Typography>
              </Stack>
              <Typography variant='caption'>Angular size</Typography>
              <Stack direction='row' justifyContent='space-between'>
                <Typography>Moon</Typography>
                <Typography><Angle value={eclipse.moonEphemeris.angularSize} /></Typography>
              </Stack>
              <Stack direction='row' justifyContent='space-between'>
                <Typography>Earth shadow umbra</Typography>
                <Typography><Angle value={eclipse.earthShadowEphemeris.umbraAngularSize} /></Typography>
              </Stack>
              <Stack direction='row' justifyContent='space-between'>
                <Typography>Earth shadow penumbra</Typography>
                <Typography><Angle value={eclipse.earthShadowEphemeris.penumbraAngularSize} /></Typography>
              </Stack>
            </>}
          </Box>
        </Stack>
      </Stack>
    </>
  );
}
