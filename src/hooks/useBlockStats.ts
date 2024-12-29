import { useState, useEffect } from 'react';
import { useMetaMask } from './useMetaMask';

interface BlockStat {
  timestamp: number;
  time?: number;
  transactions?: number;
}

interface BlockStats {
  blockTimeHistory: BlockStat[];
  transactionsHistory: BlockStat[];
}

export function useBlockStats() {
  const { provider } = useMetaMask();
  const [stats, setStats] = useState<BlockStats>({
    blockTimeHistory: [],
    transactionsHistory: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    let lastBlockTimestamp: number | null = null;

    const updateStats = async (blockNumber: number) => {
      if (!provider || !mounted) return;

      try {
        const block = await provider.getBlock(blockNumber);
        if (!block || !mounted) return;

        const timestamp = Number(block.timestamp);
        const transactions = block.transactions.length;

        // Calculate block time
        let blockTime = 0;
        if (lastBlockTimestamp) {
          blockTime = timestamp - lastBlockTimestamp;
        }
        lastBlockTimestamp = timestamp;

        setStats(prev => {
          const newBlockTimeHistory = [...prev.blockTimeHistory, {
            timestamp,
            time: blockTime
          }].slice(-20); // Keep last 20 points

          const newTransactionsHistory = [...prev.transactionsHistory, {
            timestamp,
            transactions
          }].slice(-20);

          return {
            blockTimeHistory: newBlockTimeHistory,
            transactionsHistory: newTransactionsHistory
          };
        });
      } catch (error) {
        console.error('Error updating block stats:', error);
      }
    };

    const initialize = async () => {
      if (!provider) return;

      try {
        setLoading(true);
        const latestBlock = await provider.getBlock('latest');
        if (!latestBlock || !mounted) return;

        const currentNumber = Number(latestBlock.number);
        
        // Get initial data points
        for (let i = 0; i < 20; i++) {
          await updateStats(currentNumber - i);
        }
      } catch (error) {
        console.error('Error initializing block stats:', error);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    initialize();

    // Subscribe to new blocks
    if (provider) {
      provider.on('block', updateStats);
    }

    return () => {
      mounted = false;
      if (provider) {
        provider.removeAllListeners('block');
      }
    };
  }, [provider]);

  return { stats, loading };
}