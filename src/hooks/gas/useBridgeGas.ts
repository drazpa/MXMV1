import { useState, useCallback } from 'react';
import { ethers } from 'ethers';
import { BRIDGE_ADDRESS, BRIDGE_ABI } from '../../utils/bridge/constants';
import { GAS_BUFFER_PERCENTAGE } from '../../utils/constants/gasLimits';

export function useBridgeGas() {
  const [loading, setLoading] = useState(false);

  const estimateBridgeGas = useCallback(async (
    tokenAddress: string,
    hasAllowance: boolean = false
  ) => {
    try {
      setLoading(true);

      // Get provider
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const bridge = new ethers.Contract(BRIDGE_ADDRESS, BRIDGE_ABI, signer);

      // Estimate base gas
      const baseGasLimit = tokenAddress === ethers.ZeroAddress
        ? 150000n // Native token
        : 200000n; // ERC20 token

      // Add approval gas if needed
      const totalGasLimit = hasAllowance 
        ? baseGasLimit 
        : baseGasLimit + 50000n;

      // Add buffer
      const gasLimitWithBuffer = (totalGasLimit * BigInt(100 + GAS_BUFFER_PERCENTAGE)) / 100n;

      // Get current gas price
      const feeData = await provider.getFeeData();
      if (!feeData.gasPrice) {
        throw new Error('Could not get gas price');
      }

      const gasCost = gasLimitWithBuffer * feeData.gasPrice;

      return {
        estimate: {
          gasLimit: gasLimitWithBuffer.toString(),
          gasCost: ethers.formatEther(gasCost),
          gasPrice: ethers.formatUnits(feeData.gasPrice, 'gwei')
        },
        error: null
      };
    } catch (err) {
      console.error('Gas estimation failed:', err);
      return {
        estimate: null,
        error: err instanceof Error ? err.message : 'Failed to estimate gas'
      };
    } finally {
      setLoading(false);
    }
  }, []);

  return { estimateBridgeGas, loading };
}