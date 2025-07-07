'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';

interface Props {
  data: { day: string; efficiency: string }[];
}

export function WeeklyEfficiencyChart({ data }: Props) {
  return (
    <div className='w-full h-72'>
      <ResponsiveContainer width='100%' height='100%'>
        <LineChart data={data}>
          <XAxis dataKey='day' />
          <YAxis domain={[0, 150]} tickFormatter={(tick) => `${tick}%`} />
          <Tooltip formatter={(value) => `${value}%`} />
          <ReferenceLine y={100} stroke='red' strokeDasharray='3 3' />
          <Line
            type='monotone'
            dataKey='efficiency'
            stroke='#1791c8'
            strokeWidth={2}
            dot
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
