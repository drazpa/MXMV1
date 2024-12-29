import { useState, useCallback } from 'react';
import { ethers } from 'ethers';
import { calculateBridgeGas, GAS_LIMITS } from '../utils/gasCalculator';
import { useMetaMask } from './useMetaMask';

export function useBridgeGas() {
  const { provider } = useMetaMask();
  const [estimatedGas, setEstimatedGas] = useState<string | null>(null);
  const [gasDetails, setGasDetails] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const estimateBridgeGas = useCallback(async (
    tokenAddress: string,
    amount: string,
    hasAllowance: boolean = false
  ) => {
    if (!provider) {
      setError('Provider not connected');
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const feeData = await provider.getFeeData();
      if (!feeData.gasPrice) throw new Error('Could not get gas price');

      const isNativeToken = tokenAddress === ethers.ZeroAddress;
      const needsApproval = !isNativeToken && !hasAllowance;

      const { gasLimit, gasCost, details } = calculateBridgeGas(
        isNativeToken,
        needsApproval,
        feeData.gasPrice
      );

      const formattedGas = ethers.formatEther(gasCost);
      setEstimatedGas(formattedGas);
      setGasDetails(details);

      return {
        gasLimit: gasLimit.toString(),
        gasCost: formattedGas,
        gasPrice: ethers.formatUnits(feeData.gasPrice, 'gwei')
      };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Gas estimation failed';
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  }, [provider]);

  return {
    estimatedGas,
    gasDetails,
    loading,
    error,
    estimateBridgeGas
  };
}