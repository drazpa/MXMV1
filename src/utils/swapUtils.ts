import { ethers } from 'ethers';
import { TokenInfo } from '../types/blockchain';
import { amm } from './amm';
import { serializeBigInt } from './bigIntUtils';

export function calculateSwapAmounts(
  fromToken: TokenInfo,
  toToken: TokenInfo,
  amount: string
) {
  try {
    const parsedAmount = ethers.parseEther(amount);
    const result = amm.calculateSwapAmount(fromToken, toToken, parsedAmount);
    
    if (!result) return null;

    const { amountOut, priceImpact } = result;
    
    return serializeBigInt({
      fromAmount: Number(amount),
      toAmount: Number(ethers.formatEther(amountOut)),
      priceImpact,
      fee: Number(amount) * 0.003, // 0.3% fee
      rate: Number(ethers.formatEther(amountOut)) / Number(amount)
    });
  } catch (error) {
    console.error('Calculation error:', error);
    return null;
  }
}