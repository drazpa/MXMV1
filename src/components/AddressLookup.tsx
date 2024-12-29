import React, { useState } from 'react';
import { Search } from 'lucide-react';

interface Props {
  getBalance: (address: string) => Promise<string | null>;
}

export function AddressLookup({ getBalance }: Props) {
  const [address, setAddress] = useState('');
  const [balance, setBalance] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await getBalance(address);
      setBalance(result);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-b from-gray-900 to-black p-6 rounded-lg shadow-xl border border-green-500/20">
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-green-400">
        <Search className="w-5 h-5" />
        Address Lookup
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300">Address</label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="0x..."
            className="mt-1 block w-full rounded-md bg-gray-800 border-gray-700 text-gray-100 focus:border-green-500 focus:ring-green-500"
            required
          />
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {loading ? 'Loading...' : 'Check Balance'}
        </button>
        
        {balance !== null && (
          <div className="mt-4 p-4 bg-gradient-to-r from-gray-800/50 to-gray-900/50 rounded-lg border border-green-500/10">
            <p className="text-sm font-medium text-gray-400">Balance:</p>
            <p className="text-lg font-semibold text-green-400">{balance} ETH</p>
          </div>
        )}
      </form>
    </div>
  );
}