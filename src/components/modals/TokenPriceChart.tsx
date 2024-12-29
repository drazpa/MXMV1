import React from 'react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';

interface Props {
  tokenSymbol: string;
}

export function TokenPriceChart({ tokenSymbol }: Props) {
  // Mock data - In production, fetch from an API
  const data = Array.from({ length: 24 }, (_, i) => ({
    time: i,
    price: Math.random() * 2 + 0.5
  }));

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <XAxis 
            dataKey="time" 
            stroke="#4ade80"
            tickLine={{ stroke: '#4ade80' }}
          />
          <YAxis 
            stroke="#4ade80"
            tickLine={{ stroke: '#4ade80' }}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'rgba(17, 24, 39, 0.95)',
              border: '1px solid rgba(74, 222, 128, 0.2)',
              color: '#4ade80',
              borderRadius: '0.75rem'
            }}
          />
          <Line 
            type="monotone" 
            dataKey="price" 
            stroke="#4ade80" 
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}