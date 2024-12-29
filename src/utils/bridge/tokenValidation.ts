import { ethers } from 'ethers';
import { BRIDGE_ADDRESS, BRIDGE_ABI, ERC20_ABI } from './constants';

export async function validateToken(
  provider: ethers.Provider,
  tokenAddress: string,
  amount: string
): Promise<{ isValid: boolean; error?: string }> {
  try {
    const bridge = new ethers.Contract(BRIDGE_ADDRESS, BRIDGE_ABI, provider);

    // Check if token is supported
    const isSupported = await bridge.supportedTokens(tokenAddress);
    if (!isSupported) {
      return { isValid: false, error: 'Token not supported' };
    }

    // Get token decimals
    let decimals = 18; // Default for native token
    if (tokenAddress !== ethers.ZeroAddress) {
      const token = new ethers.Contract(tokenAddress, ERC20_ABI, provider);
      decimals = await token.decimals();
    }

    // Check minimum amount
    const parsedAmount = ethers.parseUnits(amount, decimals);
    const minAmount = tokenAddress === ethers.ZeroAddress 
      ? await bridge.MIN_NATIVE_AMOUNT()
      : await bridge.minTokenAmount(tokenAddress);

    if (parsedAmount < minAmount) {
      const formattedMin = ethers.formatUnits(minAmount, decimals);
      return { 
        isValid: false, 
        error: `Amount below minimum required (${formattedMin})` 
      };
    }

    // For native token, check if enough balance for gas
    if (tokenAddress === ethers.ZeroAddress) {
      const signer = await provider.getSigner();
      const balance = await provider.getBalance(await signer.getAddress());
      if (balance < parsedAmount) {
        return {
          isValid: false,
          error: 'Insufficient balance for amount + gas'
        };
      }
    }

    return { isValid: true };
  } catch (err) {
    console.error('Token validation failed:', err);
    return { isValid: false, error: 'Failed to validate token' };
  }
}