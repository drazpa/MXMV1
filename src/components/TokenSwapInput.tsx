import React from 'react';
import { TokenInfo } from '../types/blockchain';
import { useTokenPrices } from '../hooks/useTokenPrices';

interface Props {
  label: string;
  tokens: TokenInfo[];
  selectedToken: string;
  onSelectToken: (address: string) => void;
  amount: string;
  onAmountChange?: (value: string) => void;
  readOnly?: boolean;
  disabledTokens?: string[]; // Add tokens to disable in select
}

export function TokenSwapInput({
  label,
  tokens,
  selectedToken,
  onSelectToken,
  amount,
  onAmountChange,
  readOnly,
  disabledTokens = []
}: Props) {
  const { prices } = useTokenPrices(tokens);
  const token = tokens.find(t => t.address === selectedToken);
  const price = token ? prices[token.symbol] || 0 : 0;
  const usdValue = parseFloat(amount || '0') * price;

  return (
    <div className="bg-gray-800/50 p-4 rounded-lg border border-green-500/10">
      <div className="flex justify-between mb-2">
        <span className="text-sm text-gray-400">{label}</span>
        {token && (
          <span className="text-sm text-gray-400">
            Balance: {token.balance} {token.symbol}
          </span>
        )}
      </div>

      <div className="flex gap-4">
        <input
          type="number"
          value={amount}
          onChange={e => onAmountChange?.(e.target.value)}
          className="w-full bg-transparent text-xl text-green-400 placeholder-gray-600 focus:outline-none"
          placeholder="0.0"
          readOnly={readOnly}
          min="0"
          step="any"
        />

        <select
          value={selectedToken}
          onChange={e => onSelectToken(e.target.value)}
          className="bg-gray-900 text-green-400 px-3 py-1 rounded-lg border border-green-500/20 focus:outline-none focus:border-green-500"
        >
          <option value="">Select Token</option>
          {tokens.map(token => (
            <option 
              key={token.address} 
              value={token.address}
              disabled={disabledTokens.includes(token.address)}
            >
              {token.symbol}
            </option>
          ))}
        </select>
      </div>

      {amount && price > 0 && (
        <div className="mt-1 text-sm text-gray-400">
          ≈ ${usdValue.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          })}
        </div>
      )}
    </div>
  );
}