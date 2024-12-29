import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import { NetworkDetails } from '../types/blockchain';

declare global {
  interface Window {
    ethereum?: any;
  }
}

const NETWORK_DETAILS: Record<number, Partial<NetworkDetails>> = {
  1: {
    name: 'Ethereum Mainnet',
    nativeCurrency: { symbol: 'ETH', decimals: 18 },
    blockExplorer: 'https://etherscan.io'
  },
  5: {
    name: 'Goerli Testnet',
    nativeCurrency: { symbol: 'ETH', decimals: 18 },
    blockExplorer: 'https://goerli.etherscan.io'
  },
  137: {
    name: 'Polygon Mainnet',
    nativeCurrency: { symbol: 'MATIC', decimals: 18 },
    blockExplorer: 'https://polygonscan.com'
  }
};

export function useMetaMask() {
  const [account, setAccount] = useState<string | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [networkDetails, setNetworkDetails] = useState<NetworkDetails | null>(null);

  const updateNetworkDetails = useCallback(async (id: number) => {
    const baseDetails = NETWORK_DETAILS[id] || {
      name: 'Unknown Network',
      nativeCurrency: { symbol: 'ETH', decimals: 18 }
    };

    setNetworkDetails({
      chainId: id,
      ...baseDetails
    } as NetworkDetails);
  }, []);

  const connect = useCallback(async () => {
    if (!window.ethereum) {
      throw new Error('MetaMask not installed');
    }

    try {
      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      });
      const newProvider = new ethers.BrowserProvider(window.ethereum);
      const network = await newProvider.getNetwork();
      const chainId = Number(network.chainId);
      
      setAccount(accounts[0]);
      setChainId(chainId);
      setProvider(newProvider);
      updateNetworkDetails(chainId);
    } catch (err) {
      console.error('Failed to connect:', err);
      throw err;
    }
  }, [updateNetworkDetails]);

  const disconnect = useCallback(() => {
    setAccount(null);
    setChainId(null);
    setProvider(null);
    setNetworkDetails(null);
  }, []);

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts: string[]) => {
        setAccount(accounts[0] || null);
        if (!accounts[0]) disconnect();
      });

      window.ethereum.on('chainChanged', (newChainId: string) => {
        const chainId = Number(newChainId);
        setChainId(chainId);
        updateNetworkDetails(chainId);
      });

      // Check if already connected
      window.ethereum.request({ method: 'eth_accounts' })
        .then((accounts: string[]) => {
          if (accounts.length > 0) {
            connect();
          }
        });
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeAllListeners();
      }
    };
  }, [connect, disconnect, updateNetworkDetails]);

  return {
    account,
    chainId,
    provider,
    networkDetails,
    connect,
    disconnect,
    isInstalled: !!window.ethereum
  };
}