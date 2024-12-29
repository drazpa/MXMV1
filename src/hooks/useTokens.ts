import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { TokenInfo } from '../types/blockchain';

// Default tokens available
const DEFAULT_TOKENS: Record<string, TokenInfo> = {
  MXM: {
    address: 'native',
    symbol: 'MXM',
    name: 'Native MXM',
    decimals: 18,
    standard: 'NATIVE'
  },
  MINT: {
    address: '0x961d79c237601Bf1884908AECB3D2EB2f28B50f2',
    symbol: 'MINT',
    name: 'MINT Token',
    decimals: 18,
    standard: 'ERC20'
  }
};

const ERC20_ABI = [
  'function balanceOf(address) view returns (uint256)',
  'function decimals() view returns (uint8)',
  'function symbol() view returns (string)',
  'function name() view returns (string)'
];

export function useTokens(provider: ethers.BrowserProvider | null, account: string | null) {
  const [tokens, setTokens] = useState<TokenInfo[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchBalances = async () => {
      if (!provider || !account) {
        setTokens(Object.values(DEFAULT_TOKENS).map(token => ({
          ...token,
          balance: '0'
        })));
        return;
      }
      
      setLoading(true);
      try {
        // Get native MXM balance
        const nativeBalance = await provider.getBalance(account);
        const nativeToken: TokenInfo = {
          ...DEFAULT_TOKENS.MXM,
          balance: ethers.formatEther(nativeBalance)
        };

        // Get MINT token balance
        const mintToken = DEFAULT_TOKENS.MINT;
        const mintContract = new ethers.Contract(
          mintToken.address,
          ERC20_ABI,
          provider
        );
        const mintBalance = await mintContract.balanceOf(account);
        const mintTokenWithBalance: TokenInfo = {
          ...mintToken,
          balance: ethers.formatUnits(mintBalance, mintToken.decimals)
        };

        setTokens([nativeToken, mintTokenWithBalance]);
      } catch (error) {
        console.error('Error fetching token balances:', error);
        setTokens(Object.values(DEFAULT_TOKENS).map(token => ({
          ...token,
          balance: '0'
        })));
      } finally {
        setLoading(false);
      }
    };

    fetchBalances();
    const interval = setInterval(fetchBalances, 15000);
    return () => clearInterval(interval);
  }, [provider, account]);

  return { tokens, loading };
}