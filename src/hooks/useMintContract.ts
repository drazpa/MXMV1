import { useState, useCallback, useEffect } from 'react';
import { ethers } from 'ethers';

const MINT_TOKEN_ABI = [
  'function mintTokens() external payable',
  'function mintRate() external view returns (uint256)',
  'function MIN_PURCHASE() external view returns (uint256)'
];

const MINT_TOKEN_ADDRESS = '0x961d79c237601Bf1884908AECB3D2EB2f28B50f2';

export function useMintContract(provider: ethers.BrowserProvider | null) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mintRate, setMintRate] = useState(2);

  useEffect(() => {
    const fetchContractInfo = async () => {
      if (!provider) return;
      try {
        const contract = new ethers.Contract(MINT_TOKEN_ADDRESS, MINT_TOKEN_ABI, provider);
        const rate = await contract.mintRate();
        setMintRate(Number(rate));
      } catch (err) {
        console.error('Failed to fetch contract info:', err);
      }
    };

    fetchContractInfo();
  }, [provider]);

  const estimateGas = useCallback(async (amount: string) => {
    if (!provider || !amount) return null;
    try {
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(MINT_TOKEN_ADDRESS, MINT_TOKEN_ABI, signer);
      const value = ethers.parseEther(amount);

      // First check if amount meets minimum requirement
      const minPurchase = await contract.MIN_PURCHASE();
      if (value < minPurchase) {
        throw new Error('Amount below minimum purchase');
      }
      
      // Get gas estimate with value parameter
      const gasEstimate = await contract.mintTokens.estimateGas({ value });
      const feeData = await provider.getFeeData();
      
      if (!feeData.gasPrice) throw new Error('Could not get gas price');
      
      // Add 20% buffer to gas estimate
      const gasLimit = (gasEstimate * 120n) / 100n;
      const gasCost = feeData.gasPrice * gasLimit;
      
      return ethers.formatEther(gasCost);
    } catch (err) {
      console.error('Gas estimation failed:', err);
      return null;
    }
  }, [provider]);

  const mintTokens = useCallback(async (amount: string) => {
    if (!provider) throw new Error('Provider not connected');
    setLoading(true);
    setError(null);

    try {
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(MINT_TOKEN_ADDRESS, MINT_TOKEN_ABI, signer);
      const value = ethers.parseEther(amount);

      // Get minimum purchase amount
      const minPurchase = await contract.MIN_PURCHASE();
      if (value < minPurchase) {
        throw new Error('Must send at least 0.1 MXM');
      }

      // Execute mint transaction with value
      const tx = await contract.mintTokens({ value });
      console.log('Minting transaction sent:', tx.hash);
      
      const receipt = await tx.wait();
      console.log('Minting complete:', receipt.hash);

      return receipt.hash;
    } catch (err: any) {
      console.error('Mint failed:', err);
      setError(err.message || 'Failed to mint tokens');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [provider]);

  return { mintRate, mintTokens, loading, error, estimateGas };
}