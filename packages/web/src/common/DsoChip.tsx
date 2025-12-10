import type { JSX } from 'react';
import Typography from '@mui/material/Typography';
import { formatDegrees } from '@/utils';
import type { OpenNgcObject } from '@/sdk/Conjunctions';

type DsoChipParamType = {
  dso: OpenNgcObject;
}

export default function DsoChip({ dso }: DsoChipParamType): JSX.Element {
  return (
    <Typography component='span' sx={{
      backgroundColor: 'linen',
      border: '1px solid orange',
      borderRadius: 2,
      padding: '1px 4px',
      whiteSpace: 'nowrap'
    }}>
      {dso.name}: {dso.type}
    </Typography>
  );
}