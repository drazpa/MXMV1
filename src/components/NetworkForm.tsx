import React, { useState } from 'react';
import { NetworkConfig } from '../types/blockchain';
import { Settings } from 'lucide-react';

interface Props {
  onConnect: (config: NetworkConfig) => void;
  loading: boolean;
}

export function NetworkForm({ onConnect, loading }: Props) {
  const [rpcUrl, setRpcUrl] = useState('');
  const [chainId, setChainId] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConnect({
      rpcUrl,
      chainId: parseInt(chainId, 10)
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gradient-to-b from-gray-900 to-black p-6 rounded-lg shadow-xl border border-green-500/20">
      <div className="flex items-center gap-2 mb-4">
        <Settings className="w-5 h-5 text-green-400" />
        <h2 className="text-xl font-semibold text-green-400">Network Configuration</h2>
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300">RPC URL</label>
          <input
            type="text"
            value={rpcUrl}
            onChange={(e) => setRpcUrl(e.target.value)}
            placeholder="https://..."
            className="mt-1 block w-full rounded-md bg-gray-800 border-gray-700 text-gray-100 focus:border-green-500 focus:ring-green-500"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-300">Chain ID</label>
          <input
            type="number"
            value={chainId}
            onChange={(e) => setChainId(e.target.value)}
            placeholder="1"
            className="mt-1 block w-full rounded-md bg-gray-800 border-gray-700 text-gray-100 focus:border-green-500 focus:ring-green-500"
            required
          />
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {loading ? 'Connecting...' : 'Connect'}
        </button>
      </div>
    </form>
  );
}