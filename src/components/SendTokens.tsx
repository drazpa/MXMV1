import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { ethers } from 'ethers';
import { TokenInfo } from '../types/blockchain';

interface Props {
  token: TokenInfo;
  provider: ethers.BrowserProvider | null;
  onSuccess?: () => void;
}

export function SendTokens({ token, provider, onSuccess }: Props) {
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!provider) return;

    setLoading(true);
    setError('');

    try {
      const signer = await provider.getSigner();
      const tokenContract = new ethers.Contract(
        token.address,
        ['function transfer(address to, uint256 amount)'],
        signer
      );

      const parsedAmount = ethers.parseUnits(amount, token.decimals);
      const tx = await tokenContract.transfer(recipient, parsedAmount);
      await tx.wait();
      
      setRecipient('');
      setAmount('');
      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send tokens');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSend} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-300">Recipient Address</label>
        <input
          type="text"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
          className="mt-1 block w-full rounded-md bg-gray-800 border-gray-700 text-gray-100 focus:border-green-500 focus:ring-green-500"
          placeholder="0x..."
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300">Amount</label>
        <div className="mt-1 flex rounded-md shadow-sm">
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="block w-full rounded-l-md bg-gray-800 border-gray-700 text-gray-100 focus:border-green-500 focus:ring-green-500"
            step="any"
            min="0"
            required
          />
          <span className="inline-flex items-center rounded-r-md border border-l-0 border-gray-700 bg-gray-800 px-3 text-gray-400">
            {token.symbol}
          </span>
        </div>
      </div>

      {error && (
        <div className="text-sm text-red-400">{error}</div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50"
      >
        <Send className="w-4 h-4" />
        {loading ? 'Sending...' : 'Send'}
      </button>
    </form>
  );
}