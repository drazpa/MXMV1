import { useState, useEffect } from 'react';
import { useCache } from './useCache';

interface PricePoint {
  time: number;
  value: number;
}

const CACHE_KEY_PREFIX = 'price_history_';
const HISTORY_LENGTH = 24; // 24 hours

export function usePriceHistory(symbol: string, currentPrice: number | null) {
  const [history, setHistory] = useState<PricePoint[]>([]);
  const [priceChange, setPriceChange] = useState(0);
  const { getCache, setCache } = useCache();

  useEffect(() => {
    const cacheKey = `${CACHE_KEY_PREFIX}${symbol}`;
    const cached = getCache<PricePoint[]>(cacheKey);

    if (cached) {
      setHistory(cached);
      // Calculate 24h change
      const oldestPrice = cached[0]?.value || 0;
      const latestPrice = cached[cached.length - 1]?.value || 0;
      setPriceChange(((latestPrice - oldestPrice) / oldestPrice) * 100);
      return;
    }

    // Initialize with current price if available
    if (currentPrice !== null) {
      const now = Date.now();
      const initialHistory = Array.from({ length: HISTORY_LENGTH }, (_, i) => ({
        time: now - (HISTORY_LENGTH - 1 - i) * 3600000,
        value: currentPrice * (1 + (Math.random() * 0.1 - 0.05))
      }));
      setHistory(initialHistory);
      setCache(cacheKey, initialHistory);
    }
  }, [symbol, currentPrice, getCache, setCache]);

  // Update history with new price
  useEffect(() => {
    if (currentPrice === null) return;

    const updateInterval = setInterval(() => {
      setHistory(prev => {
        const now = Date.now();
        const newHistory = [
          ...prev.slice(1),
          { time: now, value: currentPrice }
        ];

        // Calculate new price change
        const oldestPrice = newHistory[0]?.value || 0;
        setPriceChange(((currentPrice - oldestPrice) / oldestPrice) * 100);

        return newHistory;
      });
    }, 60000); // Update every minute

    return () => clearInterval(updateInterval);
  }, [currentPrice]);

  return { history, priceChange };
}