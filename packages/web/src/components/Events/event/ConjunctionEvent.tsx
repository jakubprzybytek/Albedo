import type { JSX } from 'react';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Angle from '@/common/Angle';
import BodyChip from '@/common/BodyChip';
import ConjunctionDrawing from '@/components/Conjunctions/ConjunctionDrawing';
import type { Conjunction } from '@/sdk/Conjunctions';

type ConjunctionEventParamType = {
  conjunction: Conjunction;
  expanded: boolean;
}

export default function ConjunctionEvent({ conjunction, expanded }: ConjunctionEventParamType): JSX.Element {
  return (
    <>
      <Typography variant="subtitle2">
        <>{new Date(conjunction.tde).toLocaleString('pl-pl')} CET/CEST</>
      </Typography>
      <Stack className='event-card-content' direction={expanded ? 'column' : 'row'} spacing={1}>
        <Box display='flex' justifyContent='center' alignItems='center' height={expanded ? '30vh' : '80px'}>
          <ConjunctionDrawing conjunction={conjunction} />
        </Box>
        <Stack>
          <Stack direction="row" spacing={1}>
          </Stack>
          <Typography marginBottom={1}>
            <>Conjunction between <BodyChip bodyId={conjunction.firstBody.info.id} /> and <BodyChip bodyId={conjunction.secondBody.info.id} /> with a sepration of <Angle value={conjunction.separation} />.</>
          </Typography>
          <Box sx={{ display: expanded ? 'block' : 'none' }}>
            <Typography>
              <BodyChip bodyId={conjunction.firstBody.info.id} /> angular size: <Angle value={conjunction.firstBody.ephemeris.angularSize} />. <BodyChip bodyId={conjunction.secondBody.info.id} /> angular size: <Angle value={conjunction.secondBody.ephemeris.angularSize} />.
            </Typography>
          </Box>
        </Stack>
      </Stack>
    </>
  );
}
