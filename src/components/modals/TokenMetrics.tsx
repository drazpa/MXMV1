import React from 'react';
import { Users, Wallet, CircleDollarSign, BarChart2 } from 'lucide-react';
import { TokenInfo } from '../../types/blockchain';
import { useTokenMetrics } from '../../hooks/useTokenMetrics';

interface Props {
  token: TokenInfo;
  price: number;
}

export function TokenMetrics({ token, price }: Props) {
  const { metrics, loading } = useTokenMetrics(token.address);
  
  const cards = [
    {
      title: 'Market Cap',
      value: `$${(metrics.totalSupply * price).toLocaleString()}`,
      icon: CircleDollarSign,
      change: '+2.5%'
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
      value: `$${metrics.volume24h.toLocaleString()}`,
      icon: BarChart2,
      change: '+5.2%'
    }
  ];

  return (
    <>
      {cards.map((card, i) => (
        <div 
          key={i}
          className="bg-gradient-to-r from-gray-800/30 to-gray-900/30 rounded-lg p-4 border border-green-500/10"
        >
          <div className="flex items-center gap-2 mb-2">
            <card.icon className="w-4 h-4 text-green-400" />
            <span className="text-sm text-gray-400">{card.title}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="text-lg font-bold text-green-400">
              {loading ? (
                <div className="h-6 w-24 bg-gray-800 animate-pulse rounded" />
              ) : (
                <div className="flex items-center gap-1">
                  {card.value}
                  {card.suffix && (
                    <span className="text-sm text-gray-400">{card.suffix}</span>
                  )}
                </div>
              )}
            </div>
            {card.change && (
              <span className="text-xs px-2 py-1 bg-green-500/10 rounded-full text-green-400">
                {card.change}
              </span>
            )}
          </div>
        </div>
      ))}
    </>
  );
}