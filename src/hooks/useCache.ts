import { useState } from 'react';

interface CacheEntry<T> {
  value: T;
  timestamp: number;
}

interface Cache {
  [key: string]: CacheEntry<any>;
}

export function useCache(defaultTTL = 30000) {
  const [cache, setInternalCache] = useState<Cache>({});

  const setCache = (key: string, value: any, ttl = defaultTTL) => {
    setInternalCache(prev => ({
      ...prev,
      [key]: {
        value,
        timestamp: Date.now() + ttl
      }
    }));
  };

  const getCache = <T>(key: string): T | null => {
    const entry = cache[key];
    if (!entry) return null;
    if (entry.timestamp < Date.now()) {
      // Cache expired
      setInternalCache(prev => {
        const { [key]: _, ...rest } = prev;
        return rest;
      });
      return null;
    }
    return entry.value;
  };

  const clearCache = () => {
    setInternalCache({});
  };

  return { cache, setCache, getCache, clearCache };
}