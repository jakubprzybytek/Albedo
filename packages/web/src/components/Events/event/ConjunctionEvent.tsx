import type { JSX } from 'react';
import Typography from '@mui/material/Typography';
import Angle from '@/common/Angle';
import BodyChip from '@/common/BodyChip';
import type { Conjunction } from '@/sdk/Conjunctions';

type ConjunctionEventParamType = {
  conjunction: Conjunction;
}

export default function ConjunctionEvent({ conjunction }: ConjunctionEventParamType): JSX.Element {
  return (
    <>
      <Typography variant="subtitle2" sx={{ padding: 1 }}>
        <>{new Date(conjunction.tde).toLocaleString('pl-pl')} CET/CEST</>
      </Typography>
      <Typography sx={{ pb: 1, pr: 1, pl: 1 }}>
        <>Conjunction between <BodyChip bodyId={conjunction.firstBody.info.id} /> and <BodyChip bodyId={conjunction.secondBody.info.id} /> with a sepration of <Angle value={conjunction.separation} />.</>
      </Typography>
    </>
  );
}
