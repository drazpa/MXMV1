import { ethers } from 'ethers';

export const BRIDGE_ADDRESS = '0x961d79c237601Bf1884908AECB3D2EB2f28B50f2';

export const BRIDGE_ABI = [
  // Core bridge functions
  'function bridgeTokens(address token, uint256 amount) external payable',
  'function bridgeFee() external view returns (uint256)',
  // Token validation
  'function supportedTokens(address) external view returns (bool)',
  'function minTokenAmount(address) external view returns (uint256)',
  'function MIN_NATIVE_AMOUNT() external view returns (uint256)',
  // Events
  'event BridgeInitiated(address indexed token, address indexed from, uint256 amount, uint256 nonce, uint256 timestamp)'
];

export const ERC20_ABI = [
  'function approve(address spender, uint256 amount) external returns (bool)',
  'function allowance(address owner, address spender) external view returns (uint256)',
  'function decimals() external view returns (uint8)'
];