import { useState, useCallback } from 'react';
import { ethers } from 'ethers';
import { useCache } from './useCache';
import { requestThrottler } from '../utils/requestThrottler';

const PRICE_CACHE_TTL = 60000; // 1 minute
const TWAP_CACHE_TTL = 300000; // 5 minutes

// Mock initial prices for development
const MOCK_PRICES = {
  MINT: {
    price: 2.0,
    twap: 1.98
  },
  MXM: {
    price: 1.25,
    twap: 1.23
  }
};

export function usePriceOracle(provider: ethers.BrowserProvider | null) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { getCache, setCache } = useCache();

  const getPrice = useCallback(async () => {
    const cacheKey = 'price_MINT';
    const cached = getCache(cacheKey);
    if (cached) return cached;

    try {
      setLoading(true);
      // In development, return mock data
      const mockPrice = MOCK_PRICES.MINT.price * (1 + (Math.random() * 0.02 - 0.01));
      setCache(cacheKey, mockPrice, PRICE_CACHE_TTL);
      return mockPrice;
    } catch (err) {
      console.error('Failed to fetch MINT price:', err);
      return MOCK_PRICES.MINT.price;
    } finally {
      setLoading(false);
    }
  }, [getCache, setCache]);

  const getMXMPrice = useCallback(async () => {
    const cacheKey = 'price_MXM';
    const cached = getCache(cacheKey);
    if (cached) return cached;

    try {
      setLoading(true);
      const mockPrice = MOCK_PRICES.MXM.price * (1 + (Math.random() * 0.02 - 0.01));
      setCache(cacheKey, mockPrice, PRICE_CACHE_TTL);
      return mockPrice;
    } catch (err) {
      console.error('Failed to fetch MXM price:', err);
      return MOCK_PRICES.MXM.price;
    } finally {
      setLoading(false);
    }
  }, [getCache, setCache]);

  const getTWAP = useCallback(async () => {
    const cacheKey = 'twap_MINT';
    const cached = getCache(cacheKey);
    if (cached) return cached;

    try {
      const mockTWAP = MOCK_PRICES.MINT.twap * (1 + (Math.random() * 0.01 - 0.005));
      setCache(cacheKey, mockTWAP, TWAP_CACHE_TTL);
      return mockTWAP;
    } catch (err) {
      console.error('Failed to fetch MINT TWAP:', err);
      return MOCK_PRICES.MINT.twap;
    }
  }, [getCache, setCache]);

  const getMXMTWAP = useCallback(async () => {
    const cacheKey = 'twap_MXM';
    const cached = getCache(cacheKey);
    if (cached) return cached;

    try {
      const mockTWAP = MOCK_PRICES.MXM.twap * (1 + (Math.random() * 0.01 - 0.005));
      setCache(cacheKey, mockTWAP, TWAP_CACHE_TTL);
      return mockTWAP;
    } catch (err) {
      console.error('Failed to fetch MXM TWAP:', err);
      return MOCK_PRICES.MXM.twap;
    }
  }, [getCache, setCache]);

  return {
    getPrice,
    getTWAP,
    getMXMPrice,
    getMXMTWAP,
    loading,
    error
  };
}