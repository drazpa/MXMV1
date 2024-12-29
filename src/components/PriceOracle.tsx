import React from 'react';
import { TrendingUp, Clock, BarChart2 } from 'lucide-react';
import { usePriceOracle } from '../hooks/usePriceOracle';
import { useMetaMask } from '../hooks/useMetaMask';
import { CompactPriceChart } from './CompactPriceChart';

export function PriceOracle() {
  const { provider } = useMetaMask();
  const { getPrice, getTWAP, loading } = usePriceOracle(provider);
  const [price, setPrice] = React.useState<number | null>(null);
  const [twap, setTwap] = React.useState<number | null>(null);

  React.useEffect(() => {
    const fetchPrices = async () => {
      const [currentPrice, currentTWAP] = await Promise.all([
        getPrice(),
        getTWAP()
      ]);
      
      setPrice(currentPrice);
      setTwap(currentTWAP);
    };

    fetchPrices();
    const interval = setInterval(fetchPrices, 5000);
    return () => clearInterval(interval);
  }, [getPrice, getTWAP]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {/* Current Price */}
      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-black p-6 rounded-xl shadow-xl border border-green-500/20">
        <div className="flex items-center gap-2 mb-2">
          <TrendingUp className="w-5 h-5 text-green-400" />
          <span className="text-sm text-gray-400">Current Price</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold text-green-400">
            {loading ? (
              <div className="h-8 w-24 bg-gray-800 animate-pulse rounded" />
            ) : (
              `${price?.toFixed(4) || '0.0000'} MINT`
            )}
          </div>
          <span className="text-sm px-2 py-1 bg-green-500/10 rounded-full text-green-400">
            per MXM
          </span>
        </div>
      </div>

      {/* Price Chart */}
      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-black p-6 rounded-xl shadow-xl border border-green-500/20">
        <div className="flex items-center gap-2 mb-2">
          <BarChart2 className="w-5 h-5 text-green-400" />
          <span className="text-sm text-gray-400">24h Chart</span>
        </div>
        <div className="h-16">
          <CompactPriceChart tokenSymbol="MXM" />
        </div>
      </div>

      {/* TWAP */}
      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-black p-6 rounded-xl shadow-xl border border-green-500/20">
        <div className="flex items-center gap-2 mb-2">
          <Clock className="w-5 h-5 text-green-400" />
          <span className="text-sm text-gray-400">1h TWAP</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold text-green-400">
            {loading ? (
              <div className="h-8 w-24 bg-gray-800 animate-pulse rounded" />
            ) : (
              `${twap?.toFixed(4) || '0.0000'} MINT`
            )}
          </div>
          <span className="text-sm px-2 py-1 bg-green-500/10 rounded-full text-green-400">
            Weighted
          </span>
        </div>
      </div>
    </div>
  );
}