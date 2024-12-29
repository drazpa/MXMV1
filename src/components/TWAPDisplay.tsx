import React from 'react';
import { Clock } from 'lucide-react';
import { PriceChart } from './charts/PriceChart';

interface Props {
  symbol: string;
  currentTWAP: number | null;
  twapHistory: Array<{ time: number; value: number }>;
}

export function TWAPDisplay({ symbol, currentTWAP, twapHistory }: Props) {
  const calculateTWAPChange = () => {
    if (!twapHistory.length) return 0;
    const oldestTWAP = twapHistory[0].value;
    const latestTWAP = twapHistory[twapHistory.length - 1].value;
    return ((latestTWAP - oldestTWAP) / oldestTWAP) * 100;
  };

  const twapChange = calculateTWAPChange();

  return (
    <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-black p-6 rounded-xl shadow-xl border border-green-500/20">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-green-400" />
          <h2 className="text-xl font-semibold text-green-400">{symbol} 1h TWAP</h2>
        </div>
        <div className="flex flex-col items-end">
          <div className="text-2xl font-bold text-green-400">
            ${currentTWAP?.toFixed(4) || '0.0000'}
          </div>
          <div className={`text-sm ${twapChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {twapChange >= 0 ? '+' : ''}{twapChange.toFixed(2)}%
          </div>
        </div>
      </div>
      <PriceChart data={twapHistory} />
    </div>
  );
}