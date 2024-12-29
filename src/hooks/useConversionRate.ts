import { useState, useEffect } from 'react';
import { usePriceOracle } from './usePriceOracle';
import { useMetaMask } from './useMetaMask';

export function useConversionRate(amount?: string) {
  const { provider } = useMetaMask();
  const { getPrice, loading: priceLoading } = usePriceOracle(provider);
  const [rate, setRate] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchRate = async () => {
      setLoading(true);
      try {
        const price = await getPrice(amount);
        setRate(price);
      } catch (err) {
        console.error('Failed to fetch conversion rate:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRate();
    const interval = setInterval(fetchRate, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, [getPrice, amount]);

  return {
    rate,
    loading: loading || priceLoading
  };
}