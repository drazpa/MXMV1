import { ethers } from 'ethers';

// Fixed gas price in MXM
export const FIXED_GAS_PRICE = ethers.parseUnits('0.00000125', 'ether');

// Gas limits for different operations
export const GAS_LIMITS = {
  MXM_TO_MINT: 150000n, // Base gas for MXM to MINT conversion
  MINT_TO_MXM: 200000n, // Base gas for MINT to MXM conversion
  TOKEN_APPROVAL: 50000n // Gas for token approval
} as const;

export function estimateGasCost(gasLimit: bigint): string {
  const gasCost = FIXED_GAS_PRICE * gasLimit;
  return ethers.formatEther(gasCost);
}

export function getTotalGasLimit(operation: 'MXM_TO_MINT' | 'MINT_TO_MXM', needsApproval = false): bigint {
  const baseGas = GAS_LIMITS[operation];
  const approvalGas = needsApproval ? GAS_LIMITS.TOKEN_APPROVAL : 0n;
  const totalGas = baseGas + approvalGas;
  
  // Add 20% buffer
  return (totalGas * 120n) / 100n;
}