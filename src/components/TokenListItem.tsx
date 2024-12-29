import React from 'react';
import { TokenInfo } from '../types/blockchain';
import { CompactPriceChart } from './CompactPriceChart';
import { TokenMetricsRow } from './TokenMetricsRow';
import { TokenContractRow } from './TokenContractRow';
import { TokenActivityRow } from './TokenActivityRow';
import { usePriceHistory } from '../hooks/usePriceHistory';

interface Props {
  token: TokenInfo;
  price: number;
  onClick: () => void;
}

export function TokenListItem({ token, price, onClick }: Props) {
  const balance = Number(token.balance || 0);
  const value = balance * price;
  const { history, priceChange } = usePriceHistory(token.symbol, price);

  return (
    <div className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 rounded-lg border border-green-500/10 hover:border-green-500/30 transition-colors">
      {/* Header - Token Info & Balance */}
      <div 
        onClick={onClick}
        className="p-4 cursor-pointer"
      >
        <div className="flex justify-between items-start gap-4">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-medium text-green-400">{token.symbol}</p>
                  <span className="px-2 py-0.5 bg-green-500/10 rounded-full text-xs text-green-400">
                    {token.standard || 'ERC20'}
                  </span>
                </div>
                <p className="text-sm text-gray-400">{token.name}</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-medium text-green-400">
                  {balance.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 6
                  })}
                </p>
                <div className="flex items-center gap-1 justify-end">
                  <p className="text-sm text-gray-400">
                    ${value.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    })}
                  </p>
                  <span className={`text-xs ${priceChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    ({priceChange >= 0 ? '+' : ''}{priceChange.toFixed(2)}%)
                  </span>
                </div>
              </div>
            </div>
            <div className="h-16">
              <CompactPriceChart data={history} />
            </div>
          </div>
        </div>
      </div>

      {/* Metrics */}
      <div className="px-4 pb-4">
        <TokenMetricsRow token={token} price={price} />
        <TokenContractRow token={token} />
        <TokenActivityRow token={token} />
      </div>
    </div>
  );
}