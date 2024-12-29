import React from 'react';
import { TokenInfo } from '../../types/blockchain';

interface Props {
  tokens: TokenInfo[];
  selectedToken: string;
  onSelectToken: (address: string) => void;
  amount: string;
  onAmountChange: (value: string) => void;
}

export function TokenSelector({ tokens, selectedToken, onSelectToken, amount, onAmountChange }: Props) {
  const token = tokens.find(t => t.address === selectedToken);

  return (
    <div className="bg-gray-800/30 p-4 rounded-lg space-y-3">
      <div className="flex justify-between">
        <p className="text-sm text-gray-400">From</p>
        {token && (
          <p className="text-sm text-gray-400">
            Balance: {token.balance} {token.symbol}
          </p>
        )}
      </div>

      <div className="flex gap-4">
        <input
          type="number"
          value={amount}
          onChange={e => onAmountChange(e.target.value)}
          className="w-full bg-transparent text-xl text-purple-400 placeholder-gray-600 focus:outline-none"
          placeholder="0.0"
          min="0"
          step="any"
        />

        <select
          value={selectedToken}
          onChange={e => onSelectToken(e.target.value)}
          className="bg-gray-900 text-purple-400 px-3 py-1 rounded-lg border border-purple-500/20 focus:outline-none focus:border-purple-500"
        >
          <option value="">Select Token</option>
          {tokens.map(token => (
            <option key={token.address} value={token.address}>
              {token.symbol}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}