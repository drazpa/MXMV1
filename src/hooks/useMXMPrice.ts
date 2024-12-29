import { useState, useEffect } from 'react';

// For demo purposes, we'll use a fixed price
// In production, this would fetch from an API
const MOCK_MXM_PRICE = 1.25; // $1.25 USD

export function useMXMPrice() {
  const [price, setPrice] = useState<number>(MOCK_MXM_PRICE);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPrice = async () => {
      setLoading(true);
      try {
        // In production, fetch from price API
        setPrice(MOCK_MXM_PRICE);
      } catch (error) {
        console.error('Error fetching MXM price:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPrice();
    const interval = setInterval(fetchPrice, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  return { price, loading };
}