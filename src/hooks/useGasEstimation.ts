import { useState, useCallback } from 'react';
import { ethers } from 'ethers';
import { useCache } from './useCache';

const GAS_CACHE_KEY = 'gas_estimate';
const GAS_CACHE_TTL = 30000; // 30 seconds

export function useGasEstimation() {
  const { getCache, setCache } = useCache();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const estimateGas = useCallback(async (
    provider: ethers.BrowserProvider | null,
    to: string,
    data: string,
    value: bigint = 0n
  ) => {
    if (!provider) return null;

    const cacheKey = `${GAS_CACHE_KEY}_${to}_${data}_${value}`;
    const cached = getCache(cacheKey);
    if (cached) return cached;

    setLoading(true);
    setError(null);

    try {
      const signer = await provider.getSigner();
      const from = await signer.getAddress();

      // Get current gas price
      const feeData = await provider.getFeeData();
      if (!feeData.gasPrice) throw new Error('Could not get gas price');

      // Use a default gas limit as fallback
      const defaultGasLimit = 150000n;
      let gasLimit: bigint;

      try {
        // Try to estimate gas
        gasLimit = await provider.estimateGas({
          from,
          to,
          data,
          value
        });
        
        // Add 20% buffer
        gasLimit = (gasLimit * 120n) / 100n;
      } catch (err) {
        console.warn('Gas estimation failed, using default:', err);
        gasLimit = defaultGasLimit;
      }

      const gasCost = gasLimit * feeData.gasPrice;
      const result = {
        gasLimit: gasLimit.toString(),
        gasCost: ethers.formatEther(gasCost),
        gasPrice: ethers.formatUnits(feeData.gasPrice, 'gwei')
      };

      setCache(cacheKey, result, GAS_CACHE_TTL);
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Gas estimation failed';
      console.error('Gas estimation error:', err);
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  }, [getCache, setCache]);

  return {
    estimateGas,
    loading,
    error
  };
}