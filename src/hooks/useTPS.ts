import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useMetaMask } from './useMetaMask';
import { useCache } from './useCache';
import { requestThrottler } from '../utils/requestThrottler';

const CACHE_KEY = 'tps_data';
const CACHE_TTL = 60000; // 1 minute
const REFRESH_INTERVAL = 60000; // 1 minute
const BLOCK_SAMPLE_SIZE = 100; // Increased sample size for better accuracy

export function useTPS() {
  const { provider } = useMetaMask();
  const { getCache, setCache } = useCache();
  const [tps, setTPS] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const calculateTPS = async () => {
      if (!provider) return;

      // Check cache first
      const cached = getCache(CACHE_KEY);
      if (cached) {
        setTPS(cached);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        const latestBlock = await requestThrottler.enqueue(() => 
          provider.getBlock('latest')
        );
        
        if (!latestBlock || !mounted) return;

        // Get blocks in batches to avoid rate limits
        const blockNumbers = Array.from(
          { length: BLOCK_SAMPLE_SIZE },
          (_, i) => Number(latestBlock.number) - i
        );

        const blocks = await Promise.all(
          blockNumbers.map(num => 
            requestThrottler.enqueue(() => provider.getBlock(num))
          )
        );

        const validBlocks = blocks.filter(Boolean);
        if (validBlocks.length < 2) return;

        const totalTxs = validBlocks.reduce(
          (sum, block) => sum + block.transactions.length,
          0
        );

        const timeStart = Number(validBlocks[validBlocks.length - 1].timestamp);
        const timeEnd = Number(validBlocks[0].timestamp);
        const timeDiff = timeEnd - timeStart;

        const calculatedTPS = timeDiff > 0 ? totalTxs / timeDiff : 0;

        if (mounted) {
          setTPS(calculatedTPS);
          setCache(CACHE_KEY, calculatedTPS, CACHE_TTL);
        }
      } catch (error) {
        console.error('Error calculating TPS:', error);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    calculateTPS();
    const interval = setInterval(calculateTPS, REFRESH_INTERVAL);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, [provider, getCache, setCache]);

  return { tps, loading };
}