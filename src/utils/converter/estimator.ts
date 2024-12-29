import { ethers } from 'ethers';
import { TokenInfo } from '../../types/blockchain';
import { serializeBigInt } from '../bigIntUtils';

interface ConversionEstimate {
  receiveAmount: string;
  rate: number;
  priceUSD: number;
  valueUSD: number;
  fee: string;
  gasEstimate: string;
  totalCost: string;
}

export function estimateConversion(
  fromToken: TokenInfo,
  toToken: TokenInfo,
  amount: string,
  prices: { [key: string]: number }
): ConversionEstimate | null {
  try {
    const parsedAmount = ethers.parseEther(amount);
    const fromPrice = prices[fromToken.symbol] || 0;
    const toPrice = prices[toToken.symbol] || 0;
    
    // Calculate conversion (2:1 fixed rate for MXM:MINT)
    const rate = fromToken.symbol === 'MXM' ? 2 : 0.5;
    const receiveAmount = ethers.formatEther(parsedAmount * BigInt(Math.floor(rate * 1000)) / 1000n);
    
    // Calculate USD values
    const valueUSD = Number(amount) * fromPrice;
    const priceUSD = Number(receiveAmount) * toPrice;
    
    // Estimate gas (0.1% fee)
    const fee = ethers.formatEther(parsedAmount * 1n / 1000n);
    const gasEstimate = '0.000121'; // Approximate gas cost
    
    // Calculate total cost including gas
    const totalCost = ethers.formatEther(
      parsedAmount + 
      ethers.parseEther(fee) + 
      ethers.parseEther(gasEstimate)
    );

    return serializeBigInt({
      receiveAmount,
      rate,
      priceUSD,
      valueUSD,
      fee,
      gasEstimate,
      totalCost
    });
  } catch (error) {
    console.error('Estimation error:', error);
    return null;
  }
}