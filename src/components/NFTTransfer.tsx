import React, { useState } from 'react';
import { Send, QrCode } from 'lucide-react';
import { useMetaMask } from '../hooks/useMetaMask';
import { NFT } from '../types/blockchain';
import { useNFTTransfer } from '../hooks/useNFTTransfer';

interface Props {
  nft: NFT;
  onClose: () => void;
}

export function NFTTransfer({ nft, onClose }: Props) {
  const [recipient, setRecipient] = useState('');
  const { account } = useMetaMask();
  const { transfer, loading, error } = useNFTTransfer();
  const [activeTab, setActiveTab] = useState<'send' | 'receive'>('send');

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipient) return;
    
    try {
      await transfer(nft.id, recipient);
      onClose();
    } catch (err) {
      console.error('Transfer failed:', err);
    }
  };

  return (
    <div className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 p-4 rounded-lg">
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

      {activeTab === 'send' ? (
        <form onSubmit={handleTransfer} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Recipient Address
            </label>
            <input
              type="text"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              className="w-full rounded-md bg-gray-800 border-gray-700 text-gray-100 focus:border-green-500 focus:ring-green-500"
              placeholder="0x..."
              required
            />
          </div>

          {error && (
            <div className="text-sm text-red-400 bg-red-400/10 p-2 rounded">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 disabled:opacity-50"
          >
            {loading ? 'Sending...' : 'Send NFT'}
          </button>
        </form>
      ) : (
        <div className="space-y-4">
          <div className="flex justify-center p-8">
            <div className="p-4 bg-white rounded-lg">
              <QrCode className="w-32 h-32 text-gray-900" />
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Your Address</label>
            <div className="flex items-center gap-2">
              <code className="flex-1 text-sm text-green-400 bg-gray-900/50 rounded px-3 py-2 font-mono truncate">
                {account}
              </code>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}