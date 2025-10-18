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
import { formatDegrees } from '@/utils';

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
          <Typography>
            <BodyChip bodyId={eclipse.type == EclipseType.SunEclipse ? JplBodyId.Sun : JplBodyId.Moon} /> eclipse with a sepration of <Angle value={eclipse.separation} />.
          </Typography>
          {eclipse.type == EclipseType.SunEclipse && <>
            <Typography>
              <BodyChip bodyId={JplBodyId.Sun} /> angular size: {formatDegrees(eclipse.sunEphemeris.angularSizeDeg)}
            </Typography>
            <Typography>
              <BodyChip bodyId={JplBodyId.Moon} /> angular size: {formatDegrees(eclipse.moonEphemeris.angularSizeDeg)}
            </Typography>
          </>}
        </Stack>
      </Stack>
    </>
  );
}
