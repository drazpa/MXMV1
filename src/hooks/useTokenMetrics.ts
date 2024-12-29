import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useMetaMask } from './useMetaMask';
import { useCache } from './useCache';

const CACHE_KEY_PREFIX = 'token_metrics_';
const CACHE_TTL = 60000; // 1 minute

export function useTokenMetrics(tokenAddress: string) {
  const { provider } = useMetaMask();
  const { getCache, setCache } = useCache();
  const [metrics, setMetrics] = useState({
    totalSupply: 0,
    holders: 0,
    volume24h: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    let retryTimeout: NodeJS.Timeout;

    const fetchMetrics = async (retryCount = 0) => {
      if (!provider || !tokenAddress) return;

      const cacheKey = `${CACHE_KEY_PREFIX}${tokenAddress}`;
      const cached = getCache(cacheKey);
      if (cached) {
        setMetrics(cached);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const contract = new ethers.Contract(
          tokenAddress,
          ['function totalSupply() view returns (uint256)'],
          provider
        );
        
        const totalSupply = await contract.totalSupply()
          .catch(() => ethers.parseEther('0'));
        
        const newMetrics = {
          totalSupply: Number(ethers.formatEther(totalSupply)),
          holders: 15234, // Mock data
          volume24h: 1523789 // Mock data
        };

        if (mounted) {
          setMetrics(newMetrics);
          setCache(cacheKey, newMetrics, CACHE_TTL);
        }
      } catch (error: any) {
        console.error('Error fetching token metrics:', error);
        if (error?.error?.code === -32003 && retryCount < 3) {
          retryTimeout = setTimeout(() => {
            fetchMetrics(retryCount + 1);
          }, 1000 * (retryCount + 1));
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchMetrics();

    return () => {
      mounted = false;
      if (retryTimeout) clearTimeout(retryTimeout);
    };
  }, [provider, tokenAddress, getCache, setCache]);

  return { metrics, loading };
}