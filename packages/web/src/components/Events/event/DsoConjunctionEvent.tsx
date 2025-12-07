import type { JSX } from 'react';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Angle from '@/common/Angle';
import BodyChip from '@/common/BodyChip';
import type { DsoConjunction } from '@/sdk/Conjunctions';
import DsoConjunctionDrawing from '@/components/DsoConjunctions/DsoConjunctionDrawing';
import { formatDegrees } from '@/utils';

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
            <>Conjunction between <BodyChip bodyId={conjunction.body.info.id} /> and {conjunction.dso.name} with a sepration of <Angle value={conjunction.separation} />.</>
          </Typography>
          <Box sx={{ display: expanded ? 'block' : 'none' }}>
            <Typography>
              <BodyChip bodyId={conjunction.body.info.id} /> angular size: <Angle value={conjunction.body.ephemeris.angularSize} />.
              DSO size: {formatDegrees(conjunction.dso.majorAxis)} / {formatDegrees(conjunction.dso.minorAxis)} / {conjunction.dso.positionAngle}°
            </Typography>
          </Box>
        </Stack>
      </Stack>
    </>
  );
}
