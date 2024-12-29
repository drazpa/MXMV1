import React from 'react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { useBlockHistory } from '../../hooks/useBlockHistory';

export function BlockHistoryChart() {
  const { history, loading } = useBlockHistory();

  if (loading) {
    return (
      <div className="h-64 bg-gray-800/30 animate-pulse rounded-lg" />
    );
  }

  return (
    <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-black p-6 rounded-xl shadow-xl border border-green-500/20">
      <h3 className="text-lg font-semibold text-green-400 mb-4">Block History</h3>
      <div className="h-64 bg-gradient-to-r from-gray-800/50 to-gray-900/50 rounded-lg p-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={history}>
            <XAxis 
              dataKey="timestamp" 
              stroke="#4ade80"
              tickFormatter={(value) => new Date(value * 1000).toLocaleTimeString()}
            />
            <YAxis 
              stroke="#4ade80"
              domain={['auto', 'auto']}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(17, 24, 39, 0.95)',
                border: '1px solid rgba(74, 222, 128, 0.2)',
                color: '#4ade80',
                borderRadius: '0.75rem'
              }}
              formatter={(value: number) => [value, 'Block Number']}
              labelFormatter={(label) => new Date(label * 1000).toLocaleString()}
            />
            <Line 
              type="stepAfter" 
              dataKey="number" 
              stroke="#4ade80" 
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}