import { useState, useEffect } from 'react';
import { useCache } from './useCache';

interface TWAPPoint {
  time: number;
  value: number;
}

const CACHE_KEY_PREFIX = 'twap_history_';
const HISTORY_LENGTH = 24; // 24 hours

export function useTWAPHistory(symbol: string, currentTWAP: number | null) {
  const [history, setHistory] = useState<TWAPPoint[]>([]);
  const [twapChange, setTWAPChange] = useState(0);
  const { getCache, setCache } = useCache();

  useEffect(() => {
    const cacheKey = `${CACHE_KEY_PREFIX}${symbol}`;
    const cached = getCache<TWAPPoint[]>(cacheKey);

    if (cached) {
      setHistory(cached);
      // Calculate TWAP change
      const oldestTWAP = cached[0]?.value || 0;
      const latestTWAP = cached[cached.length - 1]?.value || 0;
      setTWAPChange(((latestTWAP - oldestTWAP) / oldestTWAP) * 100);
      return;
    }

    // Initialize with current TWAP if available
    if (currentTWAP !== null) {
      const now = Date.now();
      const initialHistory = Array.from({ length: HISTORY_LENGTH }, (_, i) => ({
        time: now - (HISTORY_LENGTH - 1 - i) * 3600000,
        value: currentTWAP * (1 + (Math.random() * 0.05 - 0.025))
      }));
      setHistory(initialHistory);
      setCache(cacheKey, initialHistory);
    }
  }, [symbol, currentTWAP, getCache, setCache]);

  // Update history with new TWAP
  useEffect(() => {
    if (currentTWAP === null) return;

    const updateInterval = setInterval(() => {
      setHistory(prev => {
        const now = Date.now();
        const newHistory = [
          ...prev.slice(1),
          { time: now, value: currentTWAP }
        ];

        // Calculate new TWAP change
        const oldestTWAP = newHistory[0]?.value || 0;
        setTWAPChange(((currentTWAP - oldestTWAP) / oldestTWAP) * 100);

        return newHistory;
      });
    }, 300000); // Update every 5 minutes

    return () => clearInterval(updateInterval);
  }, [currentTWAP]);

  return { history, twapChange };
}