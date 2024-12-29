import React, { useState } from 'react';
import { ArrowRight, Info } from 'lucide-react';
import { useMetaMask } from '../../hooks/useMetaMask';
import { useTokens } from '../../hooks/useTokens';
import { useBridge } from '../../hooks/useBridge';
import { TokenSelector } from './TokenSelector';
import { NetworkSelector } from './NetworkSelector';
import { BridgeInfo } from './BridgeInfo';
import { BridgeStatus } from './BridgeStatus';

export function BridgeForm() {
  const { provider, account } = useMetaMask();
  const { tokens } = useTokens(provider, account);
  const { bridgeTokens, setupToken, loading, error } = useBridge();
  const [amount, setAmount] = useState('');
  const [selectedToken, setSelectedToken] = useState('');
  const [bridgeId, setBridgeId] = useState<string | null>(null);

  const handleBridge = async () => {
    if (!selectedToken || !amount || !provider) return;
    
    try {
      // Setup token support first
      await setupToken(provider);
      
      const token = tokens.find(t => t.address === selectedToken);
      if (!token) throw new Error('Token not found');
      
      const txHash = await bridgeTokens(provider, token.address, amount);
      setBridgeId(txHash);
      setAmount('');
      setSelectedToken('');
    } catch (err) {
      console.error('Bridge failed:', err);
    }
  };

  return (
    <div className="space-y-6">
      <NetworkSelector />
      
      <TokenSelector
        tokens={tokens}
        selectedToken={selectedToken}
        onSelectToken={setSelectedToken}
        amount={amount}
        onAmountChange={setAmount}
        disabledTokens={[]}
      />

      <div className="flex justify-center">
        <ArrowRight className="w-6 h-6 text-purple-400" />
      </div>

      <div className="bg-gray-800/30 p-4 rounded-lg">
        <p className="text-sm text-gray-400">Destination</p>
        <p className="text-purple-400 font-medium">Polygon Mainnet</p>
      </div>

      <BridgeInfo />

      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}

      {bridgeId ? (
        <BridgeStatus bridgeId={bridgeId} />
      ) : (
        <button
          onClick={handleBridge}
          disabled={!selectedToken || !amount || loading}
          className="w-full bg-purple-500 text-white py-3 px-4 rounded-lg hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Bridging...' : 'Bridge to Polygon'}
        </button>
      )}
    </div>
  );
}