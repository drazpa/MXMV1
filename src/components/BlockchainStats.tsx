import React from 'react';
import { BarChart3, TrendingUp, Clock } from 'lucide-react';
import { useBlockchainStats } from '../hooks/useBlockchainStats';

export function BlockchainStats() {
  const { stats, loading } = useBlockchainStats();

  if (loading) {
    return <div className="text-center py-4">Loading blockchain stats...</div>;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center gap-2 mb-6">
        <BarChart3 className="w-5 h-5 text-green-500" />
        <h2 className="text-xl font-semibold">Network Statistics</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-green-600" />
            <h3 className="font-medium text-green-800">Gas Price</h3>
          </div>
          <p className="text-2xl font-bold text-green-700">
            {stats.gasPrice} Gwei
          </p>
        </div>

        <div className="bg-green-50 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-green-600" />
            <h3 className="font-medium text-green-800">Block Time</h3>
          </div>
          <p className="text-2xl font-bold text-green-700">
            {stats.blockTime}s
          </p>
        </div>

        <div className="bg-green-50 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <BarChart3 className="w-4 h-4 text-green-600" />
            <h3 className="font-medium text-green-800">TPS</h3>
          </div>
          <p className="text-2xl font-bold text-green-700">
            {stats.tps}
          </p>
        </div>
      </div>
    </div>
  );
}