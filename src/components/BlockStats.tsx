import React from 'react';
import { BarChart2, Clock, Hash, FileText } from 'lucide-react';
import { useBlockchain } from '../hooks/useBlockchain';

interface Props {
  latestBlock: number;
  blockPeriod: number;
  lastBlockTxs: number;
  totalTxs: number;
  loading?: boolean;
}

export function BlockStats({ blockPeriod, lastBlockTxs, totalTxs, loading = false }: Props) {
  const { latestBlock } = useBlockchain();

  const renderValue = (value: number) => {
    if (loading) {
      return <div className="h-8 w-16 bg-gray-800 animate-pulse rounded"></div>;
    }
    return <span className="text-2xl font-bold text-green-400">{value}</span>;
  };

  return (
    <>
      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-black p-6 rounded-xl shadow-xl border border-green-500/20">
        <div className="flex items-center gap-2 mb-2">
          <Hash className="w-5 h-5 text-green-400" />
          <span className="text-sm text-gray-400">Latest Block</span>
        </div>
        <div className="flex items-center justify-between">
          {renderValue(latestBlock?.number || 0)}
          <span className="text-sm text-gray-500">#{latestBlock?.number || '--'}</span>
        </div>
      </div>

      {/* Rest of the stats remain the same... */}
    </>
  );
}