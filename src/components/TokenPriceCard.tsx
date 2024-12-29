import React from 'react';
import { TrendingUp } from 'lucide-react';
import { PriceChart } from './charts/PriceChart';

interface Props {
  symbol: string;
  price: number | null;
  priceChange: number;
  priceHistory: Array<{ time: number; value: number }>;
}

export function TokenPriceCard({ symbol, price, priceChange, priceHistory }: Props) {
  return (
    <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-black p-6 rounded-xl shadow-xl border border-green-500/20">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-green-400" />
          <h2 className="text-xl font-semibold text-green-400">{symbol} Price</h2>
        </div>
        <div className="flex flex-col items-end">
          <div className="text-2xl font-bold text-green-400">
            ${price?.toFixed(4) || '0.0000'}
          </div>
          <div className={`text-sm ${priceChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {priceChange >= 0 ? '+' : ''}{priceChange.toFixed(2)}%
          </div>
        </div>
      </div>
      <PriceChart data={priceHistory} />
    </div>
  );
}