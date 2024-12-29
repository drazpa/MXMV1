import { useState, useCallback } from 'react';
import { ethers } from 'ethers';
import { TokenInfo, SwapResult } from '../types/blockchain';
import { amm } from '../utils/amm';
import { serializeBigInt } from '../utils/bigIntUtils';

export function useSwapCalculator() {
  const [loading, setLoading] = useState(false);

  const calculateSwap = useCallback((
    fromToken: TokenInfo,
    toToken: TokenInfo,
    amount: string
  ): SwapResult | null => {
    try {
      const parsedAmount = ethers.parseEther(amount);
      const result = amm.calculateSwapAmount(fromToken, toToken, parsedAmount);
      
      if (!result) return null;

      return serializeBigInt({
        fromAmount: Number(amount),
        toAmount: Number(ethers.formatEther(result.amountOut)),
        priceImpact: result.priceImpact,
        fee: Number(amount) * 0.003,
        rate: Number(ethers.formatEther(result.amountOut)) / Number(amount)
      });
    } catch (error) {
      console.error('Calculation error:', error);
      return null;
    }
  }, []);

  return { calculateSwap, loading };
}