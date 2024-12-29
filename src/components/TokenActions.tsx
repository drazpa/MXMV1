import React, { useState } from 'react';
import { useMetaMask } from '../hooks/useMetaMask';
import { TokenInfo } from '../types/blockchain';
import { SendTokens } from './SendTokens';
import { ReceiveTokens } from './ReceiveTokens';

interface Props {
  token: TokenInfo;
  onSuccess?: () => void;
}

export function TokenActions({ token, onSuccess }: Props) {
  const [activeTab, setActiveTab] = useState<'send' | 'receive'>('send');
  const { provider, account } = useMetaMask();

  if (!account) return null;

  return (
    <div className="p-4 bg-gray-900/95 rounded-lg shadow-xl border border-green-500/20">
      <div className="flex border-b border-green-500/20 mb-4">
        <button
          onClick={() => setActiveTab('send')}
          className={`px-4 py-2 ${
            activeTab === 'send'
              ? 'border-b-2 border-green-500 text-green-400'
              : 'text-gray-400 hover:text-green-400'
          }`}
        >
          Send
        </button>
        <button
          onClick={() => setActiveTab('receive')}
          className={`px-4 py-2 ${
            activeTab === 'receive'
              ? 'border-b-2 border-green-500 text-green-400'
              : 'text-gray-400 hover:text-green-400'
          }`}
        >
          Receive
        </button>
      </div>

      {activeTab === 'send' ? (
        <SendTokens token={token} provider={provider} onSuccess={onSuccess} />
      ) : (
        <ReceiveTokens address={account} />
      )}
    </div>
  );
}