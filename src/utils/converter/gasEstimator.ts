import { ethers } from 'ethers';
import { GAS_LIMIT_BUFFER } from './constants';
import { serializeBigInt } from '../bigIntUtils';

export async function estimateConversionGas(
  provider: ethers.Provider,
  amount: string,
  isMXMtoMINT: boolean
) {
  try {
    const feeData = await provider.getFeeData();
    if (!feeData.gasPrice) return null;

    // Base gas estimates
    const baseGas = isMXMtoMINT ? 150000n : 180000n;
    
    // Add buffer
    const gasLimit = (baseGas * BigInt(100 + GAS_LIMIT_BUFFER)) / 100n;
    const gasCost = gasLimit * feeData.gasPrice;

    return serializeBigInt({
      gasLimit,
      gasCost: ethers.formatEther(gasCost),
      gasPrice: ethers.formatUnits(feeData.gasPrice, 'gwei')
    });
  } catch (err) {
    console.error('Gas estimation failed:', err);
    return null;
  }
}