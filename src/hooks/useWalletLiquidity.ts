import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { LIQUIDITY_PROVIDER } from '../utils/converter/constants';

export function useWalletLiquidity(provider: ethers.BrowserProvider | null) {
  const [mxmLiquidity, setMxmLiquidity] = useState<string>('0');
  const [mintLiquidity, setMintLiquidity] = useState<string>('0');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLiquidity = async () => {
      if (!provider) return;
      
      try {
        setLoading(true);
        
        // Get MXM balance
        const mxmBalance = await provider.getBalance(LIQUIDITY_PROVIDER);
        setMxmLiquidity(ethers.formatEther(mxmBalance));

        // Get MINT balance
        const mintContract = new ethers.Contract(
          '0x961d79c237601Bf1884908AECB3D2EB2f28B50f2',
          ['function balanceOf(address) view returns (uint256)'],
          provider
        );
        const mintBalance = await mintContract.balanceOf(LIQUIDITY_PROVIDER);
        setMintLiquidity(ethers.formatEther(mintBalance));
      } catch (err) {
        console.error('Failed to fetch liquidity:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLiquidity();
    const interval = setInterval(fetchLiquidity, 10000);
    return () => clearInterval(interval);
  }, [provider]);

  return { mxmLiquidity, mintLiquidity, loading };
}