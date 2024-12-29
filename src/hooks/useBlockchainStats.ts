import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useMetaMask } from './useMetaMask';

interface BlockchainStats {
  gasPrice: string;
  blockTime: number;
  tps: number;
}

export function useBlockchainStats() {
  const { provider } = useMetaMask();
  const [stats, setStats] = useState<BlockchainStats>({
    gasPrice: '0',
    blockTime: 0,
    tps: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      if (!provider) return;

      try {
        setLoading(true);
        
        // Get gas price
        const feeData = await provider.getFeeData();
        const gasPrice = feeData.gasPrice ? 
          ethers.formatUnits(feeData.gasPrice, 'gwei') : '0';

        // Get latest blocks for TPS and block time calculation
        const latestBlock = await provider.getBlock('latest');
        const prevBlock = await provider.getBlock(Number(latestBlock?.number) - 1);

        if (latestBlock && prevBlock) {
          const blockTime = Number(latestBlock.timestamp) - Number(prevBlock.timestamp);
          const tps = latestBlock.transactions.length / blockTime;

          setStats({
            gasPrice,
            blockTime,
            tps: parseFloat(tps.toFixed(2))
          });
        }
      } catch (error) {
        console.error('Error fetching blockchain stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 10000);
    return () => clearInterval(interval);
  }, [provider]);

  return { stats, loading };
}