import React, { useState, useEffect } from 'react';
import { Flame, AlertTriangle } from 'lucide-react';
import { useMetaMask } from '../hooks/useMetaMask';
import { useMXMPrice } from '../hooks/useMXMPrice';
import { ethers } from 'ethers';

// Dead address for burning tokens
const BURN_ADDRESS = '0x000000000000000000000000000000000000dEaD';

export function TokenBurner() {
  const { provider, account } = useMetaMask();
  const { price: mxmPrice } = useMXMPrice();
  const [amount, setAmount] = useState('');
  const [balance, setBalance] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [estimatedGas, setEstimatedGas] = useState<string | null>(null);

  useEffect(() => {
    const fetchBalance = async () => {
      if (provider && account) {
        const balance = await provider.getBalance(account);
        setBalance(ethers.formatEther(balance));
      }
    };

    fetchBalance();
    const interval = setInterval(fetchBalance, 10000);
    return () => clearInterval(interval);
  }, [provider, account]);

  useEffect(() => {
    const estimateGas = async () => {
      if (!provider || !account || !amount) {
        setEstimatedGas(null);
        return;
      }

      try {
        const signer = await provider.getSigner();
        const tx = {
          to: BURN_ADDRESS,
          value: ethers.parseEther(amount)
        };

        const gasEstimate = await signer.estimateGas(tx);
        const feeData = await provider.getFeeData();
        
        if (!feeData.gasPrice) return;
        
        const gasCost = gasEstimate * feeData.gasPrice;
        setEstimatedGas(ethers.formatEther(gasCost));
      } catch (err) {
        console.error('Gas estimation failed:', err);
        setEstimatedGas(null);
      }
    };

    estimateGas();
  }, [provider, account, amount]);

  const handleBurn = async () => {
    if (!provider || !account || !amount) return;
    
    setLoading(true);
    setError(null);

    try {
      const signer = await provider.getSigner();
      const tx = await signer.sendTransaction({
        to: BURN_ADDRESS,
        value: ethers.parseEther(amount)
      });

      await tx.wait();
      setAmount('');
      setShowConfirm(false);
    } catch (err) {
      console.error('Burn failed:', err);
      setError(err instanceof Error ? err.message : 'Failed to burn tokens');
    } finally {
      setLoading(false);
    }
  };

  if (!account) return null;

  const totalCost = amount && estimatedGas 
    ? Number(amount) + Number(estimatedGas)
    : null;

  const insufficientBalance = balance && totalCost 
    ? Number(balance) < totalCost
    : false;

  // Calculate USD values
  const amountUSD = amount ? Number(amount) * mxmPrice : 0;
  const gasUSD = estimatedGas ? Number(estimatedGas) * mxmPrice : 0;
  const totalUSD = totalCost ? totalCost * mxmPrice : 0;

  return (
    <div className="bg-gradient-to-b from-gray-900 to-black p-6 rounded-lg shadow-xl border border-red-500/20">
      <div className="flex items-center gap-2 mb-4">
        <Flame className="w-5 h-5 text-red-400" />
        <h2 className="text-xl font-semibold text-red-400">Burn MXM Tokens</h2>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Amount to Burn
          </label>
          <div className="relative">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full rounded-md bg-gray-800 border-gray-700 text-gray-100 focus:border-red-500 focus:ring-red-500"
              placeholder="0.0"
              min="0"
              step="any"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
              MXM
            </span>
          </div>
          {balance && (
            <p className="mt-1 text-sm text-gray-400">
              Balance: {Number(balance).toFixed(4)} MXM (${(Number(balance) * mxmPrice).toFixed(2)})
            </p>
          )}
          {estimatedGas && (
            <p className="mt-1 text-sm text-gray-400">
              Estimated Gas: {Number(estimatedGas).toFixed(6)} MXM (${gasUSD.toFixed(2)})
            </p>
          )}
          {totalCost && (
            <p className="mt-1 text-sm text-gray-400">
              Total Cost: {totalCost.toFixed(6)} MXM (${totalUSD.toFixed(2)})
            </p>
          )}
        </div>

        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-5 h-5 text-red-400 mt-0.5" />
            <div className="space-y-1">
              <p className="text-sm font-medium text-red-400">
                Warning: Token Burning is Irreversible
              </p>
              <p className="text-sm text-gray-400">
                Burned tokens are permanently removed from circulation and cannot be recovered.
                This action cannot be undone.
              </p>
            </div>
          </div>
        </div>

        {!showConfirm ? (
          <button
            onClick={() => setShowConfirm(true)}
            disabled={!amount || loading || insufficientBalance}
            className="w-full bg-red-500 text-white py-3 px-4 rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {insufficientBalance ? 'Insufficient Balance' : 'Burn Tokens'}
          </button>
        ) : (
          <div className="space-y-2">
            <button
              onClick={handleBurn}
              disabled={loading}
              className="w-full bg-red-500 text-white py-3 px-4 rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Burning...' : 'Confirm Burn'}
            </button>
            <button
              onClick={() => setShowConfirm(false)}
              className="w-full bg-gray-700 text-white py-3 px-4 rounded-lg hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
}