import React, { useState, useEffect } from 'react';
import { Coins, AlertCircle } from 'lucide-react';
import { useMetaMask } from '../hooks/useMetaMask';
import { useMXMPrice } from '../hooks/useMXMPrice';
import { useMintContract } from '../hooks/useMintContract';
import { ethers } from 'ethers';

export function MintTokens() {
  const { provider, account } = useMetaMask();
  const { price: mxmPrice } = useMXMPrice();
  const { mintRate, mintTokens, estimateGas, loading, error } = useMintContract(provider);
  const [amount, setAmount] = useState('');
  const [balance, setBalance] = useState<string | null>(null);
  const [estimatedGas, setEstimatedGas] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [success, setSuccess] = useState(false);

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
    const getGasEstimate = async () => {
      if (!amount || !provider || Number(amount) < 0.1) {
        setEstimatedGas(null);
        return;
      }
      const estimate = await estimateGas(amount);
      setEstimatedGas(estimate);
    };

    getGasEstimate();
  }, [amount, provider, estimateGas]);

  const handleMint = async () => {
    if (!amount) return;
    
    try {
      await mintTokens(amount);
      setSuccess(true);
      setAmount('');
      setShowConfirm(false);
      
      // Reset success message after 5 seconds
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      console.error('Mint failed:', err);
    }
  };

  if (!account) return null;

  const mintAmount = amount ? Number(amount) * mintRate : 0;
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
    <div className="bg-gradient-to-b from-gray-900 to-black p-6 rounded-lg shadow-xl border border-green-500/20">
      <div className="flex items-center gap-2 mb-4">
        <Coins className="w-5 h-5 text-green-400" />
        <h2 className="text-xl font-semibold text-green-400">Mint MINT Tokens</h2>
      </div>

      <div className="space-y-4">
        {success && (
          <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
            <p className="text-sm text-green-400">Successfully minted MINT tokens!</p>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            MXM Amount to Spend
          </label>
          <div className="relative">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full rounded-md bg-gray-800 border-gray-700 text-gray-100 focus:border-green-500 focus:ring-green-500"
              placeholder="0.0"
              min="0.1"
              step="0.1"
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
          {amount && (
            <p className="mt-1 text-sm text-gray-400">
              You will receive: {mintAmount.toFixed(2)} MINT
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

        <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-green-400 mt-0.5" />
            <div className="space-y-1">
              <p className="text-sm font-medium text-green-400">
                Current Rate: 1 MXM = {mintRate} MINT
              </p>
              <p className="text-sm text-gray-400">
                Minimum purchase amount is 0.1 MXM. Minted tokens will be sent to your wallet immediately.
              </p>
            </div>
          </div>
        </div>

        {!showConfirm ? (
          <button
            onClick={() => setShowConfirm(true)}
            disabled={!amount || loading || insufficientBalance || Number(amount) < 0.1}
            className="w-full bg-green-500 text-white py-3 px-4 rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {insufficientBalance ? 'Insufficient Balance' : 
             Number(amount) < 0.1 ? 'Minimum 0.1 MXM' : 
             'Mint Tokens'}
          </button>
        ) : (
          <div className="space-y-2">
            <button
              onClick={handleMint}
              disabled={loading}
              className="w-full bg-green-500 text-white py-3 px-4 rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Minting...' : 'Confirm Mint'}
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