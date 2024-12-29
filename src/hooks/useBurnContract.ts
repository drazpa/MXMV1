import { useState, useCallback } from 'react';
import { ethers } from 'ethers';

const BURNER_ABI = [
  'function burn() external payable',
  'function getBurnStats() external view returns (uint256 totalBurned, uint256 burnTransactions)',
  'function MIN_BURN_AMOUNT() external view returns (uint256)'
];

// Replace with your deployed contract address
const BURNER_ADDRESS = '0x961d79c237601Bf1884908AECB3D2EB2f28B50f2';

export function useBurnContract(provider: ethers.BrowserProvider | null) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const estimateGas = useCallback(async (amount: string) => {
    if (!provider) return null;
    try {
      const signer = await provider.getSigner();
      const burner = new ethers.Contract(BURNER_ADDRESS, BURNER_ABI, signer);
      const value = ethers.parseEther(amount);
      
      // Estimate gas for the burn transaction
      const gasEstimate = await burner.burn.estimateGas({ value });
      const feeData = await provider.getFeeData();
      
      if (!feeData.gasPrice) throw new Error('Could not get gas price');
      
      // Add 20% buffer to gas estimate
      const gasLimit = (gasEstimate * 120n) / 100n;
      const gasCost = feeData.gasPrice * gasLimit;
      
      return {
        gasLimit,
        gasCost: ethers.formatEther(gasCost)
      };
    } catch (err) {
      console.error('Gas estimation failed:', err);
      return null;
    }
  }, [provider]);

  const burnTokens = useCallback(async (amount: string) => {
    if (!provider) throw new Error('Provider not connected');
    setLoading(true);
    setError(null);

    try {
      const signer = await provider.getSigner();
      const burner = new ethers.Contract(BURNER_ADDRESS, BURNER_ABI, signer);
      const address = await signer.getAddress();

      // Get minimum burn amount
      const minBurnAmount = await burner.MIN_BURN_AMOUNT();
      const value = ethers.parseEther(amount);

      // Validate minimum burn amount
      if (value < minBurnAmount) {
        throw new Error('Must burn at least 1 MXM');
      }

      // Check user's balance
      const balance = await provider.getBalance(address);
      const gasEstimation = await estimateGas(amount);
      
      if (!gasEstimation) {
        throw new Error('Failed to estimate gas');
      }

      const totalNeeded = value + (gasEstimation.gasLimit * (await provider.getFeeData()).gasPrice!);
      
      if (balance < totalNeeded) {
        throw new Error('Insufficient balance for burn amount + gas');
      }

      // Execute burn transaction
      const tx = await burner.burn({
        value,
        gasLimit: gasEstimation.gasLimit
      });

      const receipt = await tx.wait();
      return receipt.hash;
    } catch (err) {
      console.error('Burn failed:', err);
      setError(err instanceof Error ? err.message : 'Failed to burn tokens');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [provider, estimateGas]);

  return { burnTokens, loading, error, estimateGas };
}