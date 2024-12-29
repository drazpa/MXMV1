import { TokenInfo, SwapResult } from '../types/blockchain';
import { ethers } from 'ethers';

const FEE_PERCENTAGE = 0.003; // 0.3%
const BASE_LIQUIDITY = 1000000; // Base liquidity for price impact calculation

export function calculateSwapAmounts(
  fromToken: TokenInfo,
  toToken: TokenInfo,
  fromAmount: string,
  prices: Record<string, number>
): SwapResult | null {
  if (!fromAmount || !fromToken || !toToken) return null;

  try {
    // Parse amount considering token decimals
    const parsedAmount = ethers.parseUnits(fromAmount, fromToken.decimals);
    const amount = Number(ethers.formatUnits(parsedAmount, fromToken.decimals));
    
    if (isNaN(amount) || amount <= 0) return null;

    // Use fixed prices for testing
    const fromPrice = fromToken.standard === 'NATIVE' ? 1 : (prices[fromToken.symbol] || 0.5);
    const toPrice = toToken.standard === 'NATIVE' ? 1 : (prices[toToken.symbol] || 0.5);
    
    if (!fromPrice || !toPrice) return null;
    
    const valueUSD = amount * fromPrice;
    const baseOutput = valueUSD / toPrice;
    const fee = baseOutput * FEE_PERCENTAGE;
    const outputAmount = baseOutput - fee;
    const priceImpact = Math.min((valueUSD / (BASE_LIQUIDITY * fromPrice)) * 100, 100);
    
    return {
      fromAmount: amount,
      toAmount: outputAmount,
      priceImpact,
      fee: fee * toPrice,
      rate: toPrice / fromPrice
    };
  } catch (error) {
    console.error('Error calculating swap amounts:', error);
    return null;
  }
}

export function validateSwap(
  fromToken: TokenInfo,
  toToken: TokenInfo,
  fromAmount: string,
  balance: string,
  estimatedGas?: string
): string | null {
  if (!fromAmount) return 'Enter an amount';
  if (!fromToken || !toToken) return 'Select tokens';
  
  try {
    const parsedAmount = ethers.parseUnits(fromAmount, fromToken.decimals);
    const parsedBalance = ethers.parseUnits(balance || '0', fromToken.decimals);
    
    // For native token, include gas in the calculation
    if (fromToken.standard === 'NATIVE' && estimatedGas) {
      const parsedGas = ethers.parseEther(estimatedGas);
      const totalNeeded = parsedAmount + parsedGas;
      
      if (totalNeeded > parsedBalance) {
        return `Insufficient balance for amount + gas (${ethers.formatEther(totalNeeded)} ${fromToken.symbol} needed)`;
      }
    } else if (parsedAmount > parsedBalance) {
      return `Insufficient balance (${ethers.formatUnits(parsedBalance, fromToken.decimals)} ${fromToken.symbol} available)`;
    }

    if (fromToken.address === toToken.address) {
      return 'Cannot swap same token';
    }

    return null;
  } catch (error) {
    console.error('Error validating swap:', error);
    return 'Invalid amount';
  }
}