import { useState, useEffect } from 'react';
import { useMetaMask } from './useMetaMask';

interface BlockHistoryPoint {
  number: number;
  timestamp: number;
}

export function useBlockHistory() {
  const { provider } = useMetaMask();
  const [history, setHistory] = useState<BlockHistoryPoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const fetchHistory = async () => {
      if (!provider) return;

      try {
        const latestBlock = await provider.getBlock('latest');
        if (!latestBlock || !mounted) return;

        const currentNumber = Number(latestBlock.number);
        const points: BlockHistoryPoint[] = [];

        // Get last 20 blocks
        for (let i = 0; i < 20; i++) {
          const blockNumber = currentNumber - i;
          const block = await provider.getBlock(blockNumber);
          if (block && mounted) {
            points.unshift({
              number: blockNumber,
              timestamp: Number(block.timestamp)
            });
          }
        }

        if (mounted) {
          setHistory(points);
          setLoading(false);
        }
      } catch (error) {
        console.error('Error fetching block history:', error);
      }
    };

    // Initial fetch
    fetchHistory();

    // Subscribe to new blocks
    if (provider) {
      provider.on('block', async (blockNumber) => {
        if (!mounted) return;
        
        try {
          const block = await provider.getBlock(blockNumber);
          if (block && mounted) {
            setHistory(prev => {
              const newHistory = [...prev, {
                number: Number(blockNumber),
                timestamp: Number(block.timestamp)
              }];
              // Keep last 20 blocks
              return newHistory.slice(-20);
            });
          }
        } catch (error) {
          console.error('Error updating block history:', error);
        }
      });
    }

    return () => {
      mounted = false;
      if (provider) {
        provider.removeAllListeners('block');
      }
    };
  }, [provider]);

  return { history, loading };
}