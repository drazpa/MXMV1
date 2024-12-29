import { useState, useCallback } from 'react';
import { ethers } from 'ethers';
import { TokenInfo } from '../types/blockchain';
import { useGasEstimation } from './useGasEstimation';

const SWAP_ROUTER_ABI = [
  'function swap(address fromToken, address toToken, uint256 fromAmount, uint256 minToAmount, uint256 deadline) external payable'
];

const SWAP_ROUTER_ADDRESS = '0x961d79c237601Bf1884908AECB3D2EB2f28B50f2';

export function useSwapContract(provider: ethers.BrowserProvider | null) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { estimateGas } = useGasEstimation();

  const getSwapCallData = (
    fromToken: TokenInfo,
    toToken: TokenInfo,
    fromAmount: string,
    minToAmount: string
  ) => {
    const contract = new ethers.Contract(SWAP_ROUTER_ADDRESS, SWAP_ROUTER_ABI);
    const fromAddress = fromToken.standard === 'NATIVE' ? ethers.ZeroAddress : fromToken.address;
    const toAddress = toToken.standard === 'NATIVE' ? ethers.ZeroAddress : toToken.address;
    const parsedFromAmount = ethers.parseUnits(fromAmount, fromToken.decimals);
    const parsedMinToAmount = ethers.parseUnits(minToAmount, toToken.decimals);
    const deadline = Math.floor(Date.now() / 1000) + 1200; // 20 minutes

    return contract.interface.encodeFunctionData('swap', [
      fromAddress,
      toAddress,
      parsedFromAmount,
      parsedMinToAmount,
      deadline
    ]);
  };

  const executeSwap = useCallback(async (
    fromToken: TokenInfo,
    toToken: TokenInfo,
    fromAmount: string,
    minToAmount: string
  ) => {
    if (!provider) throw new Error('Provider not connected');
    setLoading(true);
    setError(null);

    try {
      const signer = await provider.getSigner();
      const value = fromToken.standard === 'NATIVE' ? 
        ethers.parseUnits(fromAmount, fromToken.decimals) : 0n;

      const callData = getSwapCallData(fromToken, toToken, fromAmount, minToAmount);
      
      // Estimate gas with proper error handling
      const gasEstimate = await estimateGas(
        provider,
        SWAP_ROUTER_ADDRESS,
        callData,
        value
      );

      if (!gasEstimate) {
        throw new Error('Failed to estimate gas');
      }

      const tx = await signer.sendTransaction({
        to: SWAP_ROUTER_ADDRESS,
        data: callData,
        value,
        gasLimit: BigInt(gasEstimate.gasLimit)
      });

      const receipt = await tx.wait();
      return receipt?.hash;
    } catch (err) {
      console.error('Swap failed:', err);
      setError(err instanceof Error ? err.message : 'Swap failed');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [provider, estimateGas]);

  return { executeSwap, loading, error };
}