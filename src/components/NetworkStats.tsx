import React from 'react';
import { BarChart2, Clock, TrendingUp, Hash } from 'lucide-react';
import { useTPS } from '../hooks/useTPS';
import { useBlockchain } from '../hooks/useBlockchain';
import { NetworkStatsCharts } from './charts/NetworkStatsCharts';

interface Props {
  gasPrice: string;
  blockTime: string;
}

export function NetworkStats({ gasPrice, blockTime }: Props) {
  const { tps, loading: tpsLoading } = useTPS();
  const { latestBlock } = useBlockchain();
  
  const formatTPS = (value: number) => value.toFixed(2);

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-b from-gray-900 to-black p-6 rounded-lg shadow-xl border border-green-500/20">
        <div className="flex items-center gap-2 mb-4">
          <BarChart2 className="w-5 h-5 text-green-400" />
          <h2 className="text-xl font-semibold text-green-400">Network Statistics</h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Latest Block */}
          <div className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 p-4 rounded-lg border border-green-500/10">
            <div className="flex items-center gap-2 mb-2">
              <Hash className="w-4 h-4 text-green-400" />
              <span className="text-sm text-gray-400">Latest Block</span>
            </div>
            <div className="text-xl font-bold text-green-400">
              #{latestBlock?.number || '0'}
            </div>
          </div>

          {/* Gas Price */}
          <div className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 p-4 rounded-lg border border-green-500/10">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-green-400" />
              <span className="text-sm text-gray-400">Gas Price</span>
            </div>
            <div className="text-xl font-bold text-green-400">{gasPrice} Gwei</div>
          </div>

          {/* Block Time */}
          <div className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 p-4 rounded-lg border border-green-500/10">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-green-400" />
              <span className="text-sm text-gray-400">Block Time</span>
            </div>
            <div className="text-xl font-bold text-green-400">{blockTime}s</div>
          </div>

          {/* TPS */}
          <div className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 p-4 rounded-lg border border-green-500/10">
            <div className="flex items-center gap-2 mb-2">
              <BarChart2 className="w-4 h-4 text-green-400" />
              <span className="text-sm text-gray-400">TPS</span>
            </div>
            <div className="text-xl font-bold text-green-400">
              {tpsLoading ? (
                <div className="h-8 w-20 bg-gray-800 animate-pulse rounded" />
              ) : (
                formatTPS(tps)
              )}
            </div>
          </div>
        </div>
      </div>

      <NetworkStatsCharts 
        currentGasPrice={gasPrice}
        currentBlockTime={blockTime}
      />
    </div>
  );
}