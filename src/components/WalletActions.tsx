import React, { useState } from 'react';
import { Send, QrCode } from 'lucide-react';
import { useMetaMask } from '../hooks/useMetaMask';
import { SendTokensForm } from './SendTokensForm';
import { ReceiveTokens } from './ReceiveTokens';

export function WalletActions() {
  const [activeTab, setActiveTab] = useState<'send' | 'receive'>('send');
  const { account } = useMetaMask();

  if (!account) return null;

  return (
    <div className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 p-4 rounded-lg border border-green-500/10">
      {/* Tabs */}
      <div className="flex border-b border-green-500/20 mb-4">
        <button
          onClick={() => setActiveTab('send')}
          className={`flex items-center gap-2 px-4 py-2 ${
            activeTab === 'send'
              ? 'border-b-2 border-green-500 text-green-400'
              : 'text-gray-400 hover:text-green-400'
          }`}
        >
          <Send className="w-4 h-4" />
          Send
        </button>
        <button
          onClick={() => setActiveTab('receive')}
          className={`flex items-center gap-2 px-4 py-2 ${
            activeTab === 'receive'
              ? 'border-b-2 border-green-500 text-green-400'
              : 'text-gray-400 hover:text-green-400'
          }`}
        >
          <QrCode className="w-4 h-4" />
          Receive
        </button>
      </div>

      {/* Content */}
      {activeTab === 'send' ? (
        <SendTokensForm />
      ) : (
        <ReceiveTokens address={account} />
      )}
    </div>
  );
}