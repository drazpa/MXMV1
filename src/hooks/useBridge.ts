import { useState, useCallback } from 'react';
import { ethers } from 'ethers';
import { BRIDGE_ADDRESS, BRIDGE_ABI } from '../utils/bridge/constants';
import { validateToken } from '../utils/bridge/tokenValidation';
import { checkAllowance, approveToken } from '../utils/bridge/allowance';
import { setupBridgeToken } from '../utils/bridge/setup';

export function useBridge() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const setupToken = useCallback(async (provider: ethers.Provider) => {
    if (!provider) return;
    await setupBridgeToken(provider);
  }, []);

  const bridgeTokens = useCallback(async (
    provider: ethers.Provider,
    tokenAddress: string,
    amount: string
  ) => {
    if (!provider) throw new Error('Provider not connected');
    
    setLoading(true);
    setError(null);

    try {
      // Validate token and amount
      const validation = await validateToken(provider, tokenAddress, amount);
      if (!validation.isValid) {
        throw new Error(validation.error);
      }

      const signer = await provider.getSigner();
      const address = await signer.getAddress();

      // Check and handle allowance for ERC20 tokens
      if (tokenAddress !== ethers.ZeroAddress) {
        const hasAllowance = await checkAllowance(provider, tokenAddress, address, amount);
        if (!hasAllowance) {
          await approveToken(signer, tokenAddress, amount);
        }
      }

      // Execute bridge transaction
      const bridge = new ethers.Contract(BRIDGE_ADDRESS, BRIDGE_ABI, signer);
      const value = tokenAddress === ethers.ZeroAddress ? ethers.parseEther(amount) : 0n;
      
      const tx = await bridge.bridgeTokens(
        tokenAddress, 
        ethers.parseEther(amount),
        {
          value,
          gasLimit: 300000n // Explicit gas limit
        }
      );

      const receipt = await tx.wait();
      return receipt.hash;
    } catch (err) {
      console.error('Bridge failed:', err);
      setError(err instanceof Error ? err.message : 'Failed to bridge tokens');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { bridgeTokens, setupToken, loading, error };
}