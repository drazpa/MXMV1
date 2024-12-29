import React from 'react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { useNetworkStats } from '../../hooks/useNetworkStats';

export function NetworkStatsCharts() {
  const { stats, loading } = useNetworkStats();

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {[1, 2].map(i => (
          <div key={i} className="h-64 bg-gray-800/30 animate-pulse rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Gas Price Chart */}
      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-black p-6 rounded-xl shadow-xl border border-green-500/20">
        <h3 className="text-lg font-semibold text-green-400 mb-4">Gas Price History</h3>
        <div className="h-64 bg-gradient-to-r from-gray-800/50 to-gray-900/50 rounded-lg p-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={stats.gasPriceHistory}>
              <XAxis 
                dataKey="timestamp" 
                stroke="#4ade80"
                tickFormatter={(value) => new Date(value * 1000).toLocaleTimeString()}
              />
              <YAxis 
                stroke="#4ade80"
                tickFormatter={(value) => `${value} Gwei`}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(17, 24, 39, 0.95)',
                  border: '1px solid rgba(74, 222, 128, 0.2)',
                  color: '#4ade80',
                  borderRadius: '0.75rem'
                }}
                formatter={(value: number) => [`${value} Gwei`, 'Gas Price']}
                labelFormatter={(label) => new Date(label * 1000).toLocaleString()}
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
      </div>

      {/* Block Time Chart */}
      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-black p-6 rounded-xl shadow-xl border border-green-500/20">
        <h3 className="text-lg font-semibold text-green-400 mb-4">Block Time History</h3>
        <div className="h-64 bg-gradient-to-r from-gray-800/50 to-gray-900/50 rounded-lg p-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={stats.blockTimeHistory}>
              <XAxis 
                dataKey="timestamp" 
                stroke="#4ade80"
                tickFormatter={(value) => new Date(value * 1000).toLocaleTimeString()}
              />
              <YAxis 
                stroke="#4ade80"
                tickFormatter={(value) => `${value}s`}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(17, 24, 39, 0.95)',
                  border: '1px solid rgba(74, 222, 128, 0.2)',
                  color: '#4ade80',
                  borderRadius: '0.75rem'
                }}
                formatter={(value: number) => [`${value}s`, 'Block Time']}
                labelFormatter={(label) => new Date(label * 1000).toLocaleString()}
              />
              <Line 
                type="monotone" 
                dataKey="time" 
                stroke="#4ade80" 
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}