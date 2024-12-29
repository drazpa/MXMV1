import React from 'react';
import { X, ExternalLink, TrendingUp, Users, Wallet, CircleDollarSign } from 'lucide-react';
import { TokenInfo } from '../../types/blockchain';
import { TokenPriceChart } from './TokenPriceChart';
import { TokenContractInfo } from './TokenContractInfo';
import { TokenActivity } from './TokenActivity';
import { TokenMetrics } from './TokenMetrics';

interface Props {
  token: TokenInfo;
  onClose: () => void;
  price: number;
}

export function TokenDetailsModal({ token, onClose, price }: Props) {
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-start justify-center p-4 pt-16">
      <div className="bg-gradient-to-b from-gray-900 to-black rounded-xl shadow-2xl border border-green-500/20 w-full max-w-6xl max-h-[85vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-green-500/20 flex items-center justify-between bg-gray-900/50">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold text-green-400">{token.symbol}</h2>
            <span className="text-gray-400">{token.name}</span>
            <span className="px-2 py-1 bg-green-500/10 rounded-full text-xs text-green-400 font-medium">
              {token.standard || 'ERC20'}
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-green-400 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(85vh-80px)]">
          {/* Token Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <TokenMetrics token={token} price={price} />
          </div>

          {/* Charts and Contract Info */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 rounded-lg p-6 border border-green-500/10">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-green-400">Price Chart</h3>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-green-400">
                    ${price.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 6
                    })}
                  </span>
                  <span className="text-xs px-2 py-1 bg-green-500/10 rounded-full text-green-400">
                    +2.5%
                  </span>
                </div>
              </div>
              <TokenPriceChart tokenSymbol={token.symbol} />
            </div>

            <div className="space-y-6">
              <div className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 rounded-lg p-6 border border-green-500/10">
                <TokenContractInfo token={token} />
              </div>
            </div>
          </div>

          {/* Activity */}
          <div className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 rounded-lg p-6 border border-green-500/10">
            <TokenActivity token={token} />
          </div>
        </div>
      </div>
    </div>
  );
}