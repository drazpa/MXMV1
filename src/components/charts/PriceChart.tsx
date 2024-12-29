import React from 'react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';

interface Props {
  data: Array<{ time: number; value: number }>;
  height?: number;
}

export function PriceChart({ data, height = 160 }: Props) {
  return (
    <div style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <XAxis 
            dataKey="time"
            stroke="#4ade80"
            tickFormatter={(time) => new Date(time).getHours() + ':00'}
          />
          <YAxis 
            stroke="#4ade80"
            tickFormatter={(value) => `$${value.toFixed(2)}`}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'rgba(17, 24, 39, 0.95)',
              border: '1px solid rgba(74, 222, 128, 0.2)',
              borderRadius: '0.75rem'
            }}
            formatter={(value: number) => [`$${value.toFixed(4)}`, 'Price']}
            labelFormatter={(time) => new Date(time).toLocaleString()}
          />
          <Line 
            type="monotone" 
            dataKey="value" 
            stroke="#4ade80" 
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}