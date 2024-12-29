// Update the existing SendTokensForm.tsx to include the AddressBook
import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { ethers } from 'ethers';
import { useMetaMask } from '../hooks/useMetaMask';
import { useTokens } from '../hooks/useTokens';
import { AddressBook } from './AddressBook';

export function SendTokensForm() {
  const { provider, account } = useMetaMask();
  const { tokens } = useTokens(provider, account);
  const [selectedToken, setSelectedToken] = useState('');
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!provider || !account) return;

    setLoading(true);
    setError('');

    try {
      const signer = await provider.getSigner();
      const token = tokens.find(t => t.address === selectedToken);
      
      if (!token) throw new Error('Token not found');

      if (token.address === 'native') {
        // Send native token (ETH/MXM)
        const tx = await signer.sendTransaction({
          to: recipient,
          value: ethers.parseEther(amount)
        });
        await tx.wait();
      } else {
        // Send ERC20 token
        const tokenContract = new ethers.Contract(
          token.address,
          ['function transfer(address to, uint256 amount)'],
          signer
        );

        const parsedAmount = ethers.parseUnits(amount, token.decimals);
        const tx = await tokenContract.transfer(recipient, parsedAmount);
        await tx.wait();
      }

      setRecipient('');
      setAmount('');
      setSelectedToken('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send tokens');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Token</label>
          <select
            value={selectedToken}
            onChange={(e) => setSelectedToken(e.target.value)}
            className="w-full rounded-md bg-gray-800 border-gray-700 text-gray-100 focus:border-green-500 focus:ring-green-500"
            required
          >
            <option value="">Select Token</option>
            {tokens.map((token) => (
              <option key={token.address} value={token.address}>
                {token.symbol} ({token.balance})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Recipient Address</label>
          <input
            type="text"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            className="w-full rounded-md bg-gray-800 border-gray-700 text-gray-100 focus:border-green-500 focus:ring-green-500"
            placeholder="0x..."
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Amount</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full rounded-md bg-gray-800 border-gray-700 text-gray-100 focus:border-green-500 focus:ring-green-500"
            step="any"
            min="0"
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
          className="w-full flex items-center justify-center gap-2 bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50"
        >
          <Send className="w-4 h-4" />
          {loading ? 'Sending...' : 'Send'}
        </button>
      </form>

      <div className="border-t border-gray-700 pt-6">
        <AddressBook onSelect={setRecipient} />
      </div>
    </div>
  );
}