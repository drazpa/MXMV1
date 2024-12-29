import React from 'react';
import { Area, AreaChart, ResponsiveContainer } from 'recharts';

interface Props {
  data: Array<{ time: number; value: number }>;
}

export function CompactPriceChart({ data }: Props) {
  if (!data.length) {
    return (
      <div className="h-full w-full bg-gray-800/30 animate-pulse rounded" />
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#4ade80" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#4ade80" stopOpacity={0} />
          </linearGradient>
        </defs>
        <Area
          type="monotone"
          dataKey="value"
          stroke="#4ade80"
          strokeWidth={1.5}
          fillOpacity={1}
          fill="url(#colorPrice)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}