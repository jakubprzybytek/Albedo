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

type EclipseEventParamType = {
  eclipse: Eclipse;
}

export default function EclipseEvent({ eclipse }: EclipseEventParamType): JSX.Element {
  return (
    <>
      <Typography variant="subtitle2">
        <>{new Date(eclipse.tde).toLocaleString('pl-pl')} CET/CEST</>
      </Typography>
      <Stack className='event-card-content' direction="row" spacing={1}>
        <Box width='80px' height='80px'>
          <EclipseDrawing eclipse={eclipse} />
        </Box>
        <Stack>
          <Typography marginBottom={1}>
            <BodyChip bodyId={eclipse.type == EclipseType.SunEclipse ? JplBodyId.Sun : JplBodyId.Moon} /> eclipse with a sepration of <Angle value={eclipse.separation} />.
          </Typography>
          {eclipse.type == EclipseType.SunEclipse && <>
            <Typography>
              Sun angular size: <Angle value={eclipse.sunEphemeris.angularSizeDeg} />. Moon angular size: <Angle value={eclipse.moonEphemeris.angularSizeDeg} />.
            </Typography>
          </>}
          {eclipse.type == EclipseType.MoonEclipse && <>
            <Typography>
              Moon angular size: <Angle value={eclipse.moonEphemeris.angularSizeDeg} />.
            </Typography>
            <Typography>
              Earth shadow umbra angular size: <Angle value={eclipse.earthShadowEphemeris.umbraAngularSizeDeg} />, penumbra angular size: <Angle value={eclipse.earthShadowEphemeris.penumbraAngularSizeDeg} />.
            </Typography>
          </>}
        </Stack>
      </Stack>
    </>
  );
}
