export const GAS_LIMITS = {
  BRIDGE_NATIVE: 150000n,    // Base gas for bridging native token
  BRIDGE_ERC20: 200000n,     // Base gas for bridging ERC20 tokens
  TOKEN_APPROVAL: 50000n     // Gas for token approval
} as const;

export const GAS_BUFFER_PERCENTAGE = 20; // 20% buffer for gas estimates