import { useState } from 'react';
import { ethers } from 'ethers';
import { useMetaMask } from './useMetaMask';

const NFT_ABI = [
  'function transferFrom(address from, address to, uint256 tokenId)',
  'function safeTransferFrom(address from, address to, uint256 tokenId)'
];

export function useNFTTransfer() {
  const { provider, account } = useMetaMask();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const transfer = async (tokenId: string, to: string) => {
    if (!provider || !account) throw new Error('Wallet not connected');
    setLoading(true);
    setError(null);

    try {
      const signer = await provider.getSigner();
      const nftContract = new ethers.Contract(
        process.env.NFT_CONTRACT_ADDRESS || '',
        NFT_ABI,
        signer
      );

      const tx = await nftContract.safeTransferFrom(account, to, tokenId);
      await tx.wait();
    } catch (err) {
      console.error('NFT transfer failed:', err);
      setError(err instanceof Error ? err.message : 'Transfer failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { transfer, loading, error };
}