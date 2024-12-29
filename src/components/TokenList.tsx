import React, { useState } from 'react';
import { Coins } from 'lucide-react';
import { TokenInfo } from '../types/blockchain';
import { useTokenPrices } from '../hooks/useTokenPrices';
import { TokenDetailsModal } from './modals/TokenDetailsModal';
import { TokenListItem } from './TokenListItem';

interface Props {
  tokens: TokenInfo[];
  loading: boolean;
  onTransferSuccess?: () => void;
}

export function TokenList({ tokens, loading, onTransferSuccess }: Props) {
  const { prices, loading: pricesLoading } = useTokenPrices(tokens);
  const [selectedToken, setSelectedToken] = useState<TokenInfo | null>(null);

  const totalValue = tokens.reduce((sum, token) => {
    const price = prices[token.symbol] || 0;
    const balance = Number(token.balance || 0);
    return sum + (balance * price);
  }, 0);

  return (
    <div className="space-y-8">
      {/* Total Value Card */}
      <div className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 p-6 rounded-lg border border-green-500/10">
        <h3 className="text-lg font-medium text-gray-400 mb-2">Total Value</h3>
        <p className="text-3xl font-bold text-green-400">
          ${totalValue.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          })}
        </p>
      </div>

      {/* Token List */}
      <div className="bg-gradient-to-b from-gray-900 to-black p-6 rounded-lg shadow-xl border border-green-500/20">
        <div className="flex items-center gap-2 mb-4">
          <Coins className="w-5 h-5 text-green-400" />
          <h2 className="text-xl font-semibold text-green-400">Token Balances</h2>
        </div>

        <div className="space-y-4">
          {loading || pricesLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-800/50 animate-pulse rounded-lg" />
              ))}
            </div>
          ) : tokens.length > 0 ? (
            tokens.map((token) => (
              <TokenListItem
                key={token.address}
                token={token}
                price={prices[token.symbol] || 0}
                onClick={() => setSelectedToken(token)}
              />
            ))
          ) : (
            <p className="text-center text-gray-400">No tokens found</p>
          )}
        </div>
      </div>

      {selectedToken && (
        <TokenDetailsModal
          token={selectedToken}
          onClose={() => setSelectedToken(null)}
          price={prices[selectedToken.symbol] || 0}
        />
      )}
    </div>
  );
}