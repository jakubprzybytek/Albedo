import type { JSX } from 'react';
import Typography from '@mui/material/Typography';
import Angle from '@/common/Angle';
import BodyChip from '@/common/BodyChip';
import type { Eclipse } from '@/sdk/Eclipses';
import { EclipseType } from '@/sdk/Eclipses';
import { jplBodyFromId, JplBodyId } from '@jpl';

type EclipseEventParamType = {
  eclipse: Eclipse;
}

export default function EclipseEvent({ eclipse }: EclipseEventParamType): JSX.Element {
  return (
    <>
      <Typography variant="subtitle2" sx={{ padding: 1 }}>
        <>{new Date(eclipse.tde).toLocaleString('pl-pl')} CET/CEST</>
      </Typography>
      <Typography sx={{ pb: 1, pr: 1, pl: 1 }}>
        <BodyChip bodyId={eclipse.type == EclipseType.SunEclipse ? JplBodyId.Sun : JplBodyId.Moon} /> eclipse with a sepration of <Angle value={eclipse.separation} />.
      </Typography>
    </>
  );
}
