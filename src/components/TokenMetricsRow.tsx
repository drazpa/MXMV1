import React from 'react';
import { Users, Wallet, CircleDollarSign, BarChart2 } from 'lucide-react';
import { TokenInfo } from '../types/blockchain';
import { useTokenMetrics } from '../hooks/useTokenMetrics';
import { useTokenVolume } from '../hooks/useTokenVolume';

interface Props {
  token: TokenInfo;
  price: number;
}

export function TokenMetricsRow({ token, price }: Props) {
  const { metrics, loading: metricsLoading } = useTokenMetrics(token.address);
  const { volume24h, loading: volumeLoading } = useTokenVolume(token.address);

  const items = [
    {
      title: 'Market Cap',
      value: `$${(metrics.totalSupply * price).toLocaleString()}`,
      icon: CircleDollarSign
    },
    {
      title: 'Total Supply',
      value: metrics.totalSupply.toLocaleString(),
      icon: Wallet,
      suffix: token.symbol
    },
    {
      title: 'Holders',
      value: metrics.holders.toLocaleString(),
      icon: Users
    },
    {
      title: '24h Volume',
      value: `$${volume24h.toLocaleString()}`,
      icon: BarChart2,
      loading: volumeLoading
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
      {items.map((item, i) => (
        <div 
          key={i}
          className="bg-gray-800/30 rounded-lg p-3"
        >
          <div className="flex items-center gap-2 mb-1">
            <item.icon className="w-4 h-4 text-green-400" />
            <span className="text-xs text-gray-400">{item.title}</span>
          </div>
          <div className="text-sm font-medium text-green-400">
            {item.loading || metricsLoading ? (
              <div className="h-4 w-16 bg-gray-800 animate-pulse rounded" />
            ) : (
              <div className="flex items-center gap-1">
                {item.value}
                {item.suffix && (
                  <span className="text-xs text-gray-400">{item.suffix}</span>
                )}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}