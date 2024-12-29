import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { TransactionActivity } from '../types/blockchain';

export function useWalletActivity(provider: ethers.BrowserProvider | null, account: string | null) {
  const [activities, setActivities] = useState<TransactionActivity[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchActivity = async () => {
      if (!provider || !account) return;
      
      setLoading(true);
      try {
        const blockNumber = await provider.getBlockNumber();
        const startBlock = blockNumber - 100; // Last 100 blocks

        const filter = {
          fromBlock: startBlock,
          toBlock: blockNumber,
          address: account
        };

        const logs = await provider.getLogs(filter);
        const transactions = await Promise.all(
          logs.map(async (log) => {
            const tx = await provider.getTransaction(log.transactionHash);
            const block = await provider.getBlock(log.blockNumber);
            return {
              hash: log.transactionHash,
              from: tx?.from || '',
              to: tx?.to || '',
              value: tx ? ethers.formatEther(tx.value) : '0',
              timestamp: block ? Number(block.timestamp) : Date.now() / 1000
            };
          })
        );

        setActivities(transactions);
      } catch (error) {
        console.error('Error fetching wallet activity:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchActivity();
  }, [provider, account]);

  return { activities, loading };
}