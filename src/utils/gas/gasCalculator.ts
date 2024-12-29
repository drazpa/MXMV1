import { ethers } from 'ethers';
import { GAS_LIMITS, GAS_BUFFER_PERCENTAGE } from '../constants/gasLimits';
import { GasCalculation } from '../../types/gas';

export function calculateBridgeGas(
  isNativeToken: boolean,
  needsApproval: boolean,
  gasPrice: bigint
): GasCalculation {
  const details: string[] = [];
  let totalGas = isNativeToken ? GAS_LIMITS.BRIDGE_NATIVE : GAS_LIMITS.BRIDGE_ERC20;
  
  details.push(`Base bridge gas: ${totalGas.toString()}`);

  if (!isNativeToken && needsApproval) {
    totalGas += GAS_LIMITS.TOKEN_APPROVAL;
    details.push(`Token approval gas: ${GAS_LIMITS.TOKEN_APPROVAL.toString()}`);
  }

  const gasLimit = (totalGas * BigInt(100 + GAS_BUFFER_PERCENTAGE)) / 100n;
  const gasCost = gasLimit * gasPrice;

  details.push(`Total gas limit with ${GAS_BUFFER_PERCENTAGE}% buffer: ${gasLimit.toString()}`);
  
  return { gasLimit, gasCost, details };
}