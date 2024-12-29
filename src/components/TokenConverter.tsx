import React, { useState, useEffect } from 'react';
import { ArrowDownUp, AlertCircle, Calculator } from 'lucide-react';
import { useMetaMask } from '../hooks/useMetaMask';
import { useConverterContract } from '../hooks/useConverterContract';
import { useMXMPrice } from '../hooks/useMXMPrice';
import { estimateConversion } from '../utils/converter/estimator';
import { ethers } from 'ethers';

export function TokenConverter() {
  const { provider, account } = useMetaMask();
  const { price: mxmPrice } = useMXMPrice();
  const { 
    conversionRate, 
    convertMXMtoMINT, 
    convertMINTtoMXM,
    loading, 
    error 
  } = useConverterContract(provider);
  
  const [amount, setAmount] = useState('');
  const [direction, setDirection] = useState<'MXMtoMINT' | 'MINTtoMXM'>('MXMtoMINT');
  const [mxmBalance, setMxmBalance] = useState<string>('0');
  const [mintBalance, setMintBalance] = useState<string>('0');
  const [estimate, setEstimate] = useState<any>(null);

  useEffect(() => {
    const fetchBalances = async () => {
      if (!provider || !account) return;
      
      try {
        // Get MXM balance
        const mxm = await provider.getBalance(account);
        setMxmBalance(ethers.formatEther(mxm));

        // Get MINT balance
        const mintContract = new ethers.Contract(
          '0x961d79c237601Bf1884908AECB3D2EB2f28B50f2',
          ['function balanceOf(address) view returns (uint256)'],
          provider
        );
        const mint = await mintContract.balanceOf(account);
        setMintBalance(ethers.formatEther(mint));
      } catch (err) {
        console.error('Failed to fetch balances:', err);
      }
    };

    fetchBalances();
    const interval = setInterval(fetchBalances, 5000);
    return () => clearInterval(interval);
  }, [provider, account]);

  // Update estimate when amount or direction changes
  useEffect(() => {
    if (!amount) {
      setEstimate(null);
      return;
    }

    const fromToken = {
      symbol: direction === 'MXMtoMINT' ? 'MXM' : 'MINT',
      balance: direction === 'MXMtoMINT' ? mxmBalance : mintBalance
    };

    const toToken = {
      symbol: direction === 'MXMtoMINT' ? 'MINT' : 'MXM',
      balance: direction === 'MXMtoMINT' ? mintBalance : mxmBalance
    };

    const prices = {
      MXM: mxmPrice,
      MINT: mxmPrice * 0.5 // MINT price is half of MXM for example
    };

    const result = estimateConversion(fromToken, toToken, amount, prices);
    setEstimate(result);
  }, [amount, direction, mxmPrice, mxmBalance, mintBalance]);

  const handleConvert = async () => {
    if (!amount) return;
    
    try {
      if (direction === 'MXMtoMINT') {
        await convertMXMtoMINT(amount);
      } else {
        await convertMINTtoMXM(amount);
      }
      setAmount('');
    } catch (err) {
      console.error('Conversion failed:', err);
    }
  };

  const switchDirection = () => {
    setDirection(prev => prev === 'MXMtoMINT' ? 'MINTtoMXM' : 'MXMtoMINT');
    setAmount('');
  };

  const getCurrentBalance = () => {
    return direction === 'MXMtoMINT' ? mxmBalance : mintBalance;
  };

  const insufficientBalance = () => {
    if (!amount || !estimate) return false;
    const value = parseFloat(amount);
    const totalNeeded = parseFloat(estimate.totalCost);
    const balance = parseFloat(getCurrentBalance());
    return totalNeeded > balance;
  };

  return (
    <div className="bg-gradient-to-b from-gray-900 to-black p-6 rounded-lg shadow-xl border border-green-500/20">
      <div className="flex items-center gap-2 mb-4">
        <ArrowDownUp className="w-5 h-5 text-green-400" />
        <h2 className="text-xl font-semibold text-green-400">Convert Tokens</h2>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            {direction === 'MXMtoMINT' ? 'MXM Amount' : 'MINT Amount'}
          </label>
          <div className="relative">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full rounded-md bg-gray-800 border-gray-700 text-gray-100 focus:border-green-500 focus:ring-green-500"
              placeholder="0.0"
              min="0"
              step="any"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
              {direction === 'MXMtoMINT' ? 'MXM' : 'MINT'}
            </span>
          </div>
          <p className="mt-1 text-sm text-gray-400">
            Balance: {Number(getCurrentBalance()).toFixed(6)} {direction === 'MXMtoMINT' ? 'MXM' : 'MINT'}
          </p>
        </div>

        <div className="flex justify-center">
          <button
            onClick={switchDirection}
            className="p-2 bg-gray-800 rounded-full hover:bg-gray-700 transition-colors"
          >
            <ArrowDownUp className="w-5 h-5 text-green-400" />
          </button>
        </div>

        {estimate && (
          <div className="bg-gray-800/30 p-4 rounded-lg space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">You Will Receive</span>
              <span className="text-green-400">
                {estimate.receiveAmount} {direction === 'MXMtoMINT' ? 'MINT' : 'MXM'}
              </span>
            </div>
            
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Rate</span>
              <span className="text-green-400">
                1 {direction === 'MXMtoMINT' ? 'MXM' : 'MINT'} = {estimate.rate} {direction === 'MXMtoMINT' ? 'MINT' : 'MXM'}
              </span>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Value USD</span>
              <span className="text-green-400">
                ${estimate.valueUSD.toFixed(2)}
              </span>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Network Fee</span>
              <span className="text-green-400">
                {estimate.fee} {direction === 'MXMtoMINT' ? 'MXM' : 'MINT'}
              </span>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Gas Estimate</span>
              <span className="text-green-400">
                {estimate.gasEstimate} MXM
              </span>
            </div>

            <div className="border-t border-gray-700 pt-2 mt-2">
              <div className="flex justify-between text-sm font-medium">
                <span className="text-gray-400">Total Cost</span>
                <span className="text-green-400">
                  {estimate.totalCost} {direction === 'MXMtoMINT' ? 'MXM' : 'MINT'}
                </span>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        <button
          onClick={handleConvert}
          disabled={!amount || loading || insufficientBalance()}
          className="w-full bg-green-500 text-white py-3 px-4 rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Converting...' : 
           insufficientBalance() ? 'Insufficient Balance' :
           'Convert'}
        </button>
      </div>
    </div>
  );
}