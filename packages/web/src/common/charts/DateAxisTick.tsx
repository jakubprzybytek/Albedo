import type { JSX } from 'react';
import { format } from 'date-fns';

type DateAxisTickPropsType = {
  x: number;
  y: number;
  stroke: number;
  payload: any;
}

export default function DateAxisTick(props: any): JSX.Element {
  const { x, y, stroke, payload } = props as DateAxisTickPropsType;

  if (payload.value === 0 || payload.value === 'auto') {
    return (<></>);
  }

  return (
    <g transform={`translate(${x},${y})`}>
      <text x={0} y={0} dy={16} textAnchor="end" fill="#666">
        {format(Date.parse(payload.value), 'yyyy-MM-dd')}
      </text>
    </g>
  );
}
