import { useState, useEffect } from 'react';
import { TokenInfo } from '../types/blockchain';

const COINGECKO_API = 'https://api.coingecko.com/api/v3';

export function useTokenPrices(tokens: TokenInfo[]) {
  const [prices, setPrices] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPrices = async () => {
      if (tokens.length === 0) return;

      setLoading(true);
      try {
        // For demo purposes, we'll set some static prices
        // In production, you would fetch from CoinGecko or another API
        setPrices({
          MXM: 1.25, // Example price in USD
          MINT: 0.50
        });
      } catch (error) {
        console.error('Error fetching token prices:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPrices();
    const interval = setInterval(fetchPrices, 60000); // Update every minute
    return () => clearInterval(interval);
  }, [tokens]);

  return { prices, loading };
}