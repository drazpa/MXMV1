import { ethers } from 'ethers';

export const GAS_LIMITS = {
  BRIDGE_NATIVE: 150000n,    // Base gas for bridging native token
  BRIDGE_ERC20: 200000n,     // Base gas for bridging ERC20 tokens
  TOKEN_APPROVAL: 50000n     // Gas for token approval
};

export function calculateBridgeGas(
  isNativeToken: boolean,
  needsApproval: boolean,
  gasPrice: bigint
): {
  gasLimit: bigint;
  gasCost: bigint;
  details: string[];
} {
  const details: string[] = [];
  let totalGas = isNativeToken ? GAS_LIMITS.BRIDGE_NATIVE : GAS_LIMITS.BRIDGE_ERC20;
  
  details.push(`Base bridge gas: ${totalGas.toString()}`);

  if (!isNativeToken && needsApproval) {
    totalGas += GAS_LIMITS.TOKEN_APPROVAL;
    details.push(`Token approval gas: ${GAS_LIMITS.TOKEN_APPROVAL.toString()}`);
  }

  // Add 20% buffer
  const gasLimit = (totalGas * 120n) / 100n;
  const gasCost = gasLimit * gasPrice;

  details.push(`Total gas limit with 20% buffer: ${gasLimit.toString()}`);
  
  return { gasLimit, gasCost, details };
}