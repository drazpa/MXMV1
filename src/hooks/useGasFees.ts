import { useState, useCallback } from 'react';
import { ethers } from 'ethers';
import { useMetaMask } from './useMetaMask';
import { useCache } from './useCache';

const GAS_CACHE_KEY = 'gas_estimate';
const GAS_CACHE_TTL = 30000; // 30 seconds

export function useGasFees() {
  const { provider } = useMetaMask();
  const { getCache, setCache } = useCache();
  const [estimatedGas, setEstimatedGas] = useState<string | null>(null);
  const [gasPrice, setGasPrice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const estimateGasFees = useCallback(async (
    fromToken: string,
    toToken: string,
    amount: string
  ) => {
    if (!provider || !amount || !fromToken || !toToken) {
      setEstimatedGas(null);
      setGasPrice(null);
      return;
    }

    const cacheKey = `${GAS_CACHE_KEY}_${fromToken}_${toToken}_${amount}`;
    const cached = getCache(cacheKey);
    if (cached) {
      setEstimatedGas(cached.estimatedGas);
      setGasPrice(cached.gasPrice);
      return;
    }
    
    setLoading(true);
    try {
      // Get current gas price
      const feeData = await provider.getFeeData();
      if (!feeData.gasPrice) throw new Error('Could not get gas price');

      // Get gas price in Gwei for display
      const gasPriceInGwei = ethers.formatUnits(feeData.gasPrice, 'gwei');
      setGasPrice(gasPriceInGwei);

      // Default gas estimate for swaps
      const defaultGasLimit = 150000n;
      const totalGasCost = feeData.gasPrice * defaultGasLimit;
      const formattedGas = ethers.formatEther(totalGasCost);
      
      setEstimatedGas(formattedGas);
      setCache(cacheKey, { 
        estimatedGas: formattedGas, 
        gasPrice: gasPriceInGwei 
      }, GAS_CACHE_TTL);
    } catch (error) {
      console.error('Error estimating gas:', error);
      setEstimatedGas(null);
      setGasPrice(null);
    } finally {
      setLoading(false);
    }
  }, [provider, getCache, setCache]);

  return {
    estimatedGas,
    gasPrice,
    loading,
    estimateGasFees
  };
}