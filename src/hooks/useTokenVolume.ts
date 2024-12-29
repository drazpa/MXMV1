import { useState, useEffect } from 'react';
import { useCache } from './useCache';

const CACHE_KEY_PREFIX = 'token_volume_';
const CACHE_TTL = 300000; // 5 minutes

export function useTokenVolume(tokenAddress: string) {
  const [volume24h, setVolume24h] = useState(0);
  const [loading, setLoading] = useState(true);
  const { getCache, setCache } = useCache();

  useEffect(() => {
    const fetchVolume = async () => {
      const cacheKey = `${CACHE_KEY_PREFIX}${tokenAddress}`;
      const cached = getCache(cacheKey);
      
      if (cached) {
        setVolume24h(cached);
        setLoading(false);
        return;
      }

      // Generate mock volume data
      const mockVolume = Math.random() * 1000000 + 500000;
      setVolume24h(mockVolume);
      setCache(cacheKey, mockVolume, CACHE_TTL);
      setLoading(false);
    };

    fetchVolume();
  }, [tokenAddress, getCache, setCache]);

  return { volume24h, loading };
}