import React, { useState } from 'react';
import { ArrowRight, Info } from 'lucide-react';
import { useMetaMask } from '../hooks/useMetaMask';
import { useTokens } from '../hooks/useTokens';
import { TokenSwapInput } from './TokenSwapInput';

export function TokenBridge() {
  const { provider, account } = useMetaMask();
  const { tokens } = useTokens(provider, account);
  const [amount, setAmount] = useState('');
  const [selectedToken, setSelectedToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleBridge = async () => {
    if (!provider || !account || !selectedToken || !amount) return;
    
    setLoading(true);
    setError(null);

    try {
      const token = tokens.find(t => t.address === selectedToken);
      if (!token) throw new Error('Token not found');

      // Bridge logic will be implemented here
      // For now, show a message
      alert('Bridge functionality coming soon!');
    } catch (err) {
      console.error('Bridge failed:', err);
      setError(err instanceof Error ? err.message : 'Failed to bridge tokens');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-b from-gray-900 to-black p-6 rounded-lg shadow-xl border border-purple-500/20">
      <div className="flex items-center gap-2 mb-6">
        <ArrowRight className="w-5 h-5 text-purple-400" />
        <h2 className="text-xl font-semibold text-purple-400">Bridge to Polygon</h2>
      </div>

      <div className="space-y-6">
        <TokenSwapInput
          label="Amount to Bridge"
          tokens={tokens}
          selectedToken={selectedToken}
          onSelectToken={setSelectedToken}
          amount={amount}
          onAmountChange={setAmount}
          disabledTokens={[]}
        />

        <div className="bg-purple-500/10 rounded-lg p-4 border border-purple-500/20">
          <div className="flex items-start gap-2">
            <Info className="w-5 h-5 text-purple-400 mt-0.5" />
            <div className="space-y-1">
              <p className="text-sm text-purple-400">Bridge Information</p>
              <ul className="text-sm text-gray-400 list-disc list-inside space-y-1">
                <li>Bridge fee: 0.5%</li>
                <li>Average completion time: 10-30 minutes</li>
                <li>Minimum amount: 0.1 tokens</li>
              </ul>
            </div>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        <button
          onClick={handleBridge}
          disabled={!selectedToken || !amount || loading}
          className="w-full bg-purple-500 text-white py-3 px-4 rounded-lg hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Bridging...' : 'Bridge to Polygon'}
        </button>
      </div>
    </div>
  );
}