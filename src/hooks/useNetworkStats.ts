import { useState, useEffect } from 'react';

interface NetworkStat {
  timestamp: number;
  price?: number;
  time?: number;
}

interface NetworkStats {
  gasPriceHistory: NetworkStat[];
  blockTimeHistory: NetworkStat[];
}

export function useNetworkStats() {
  const [stats, setStats] = useState<NetworkStats>({
    gasPriceHistory: [],
    blockTimeHistory: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Generate mock historical data for demonstration
    const now = Math.floor(Date.now() / 1000);
    const mockData = Array.from({ length: 24 }, (_, i) => ({
      timestamp: now - (23 - i) * 300 // 5-minute intervals
    }));

    const gasPriceHistory = mockData.map(point => ({
      ...point,
      price: 0.00000122 + (Math.random() - 0.5) * 0.00000010
    }));

    const blockTimeHistory = mockData.map(point => ({
      ...point,
      time: 5 + (Math.random() - 0.5) * 2
    }));

    setStats({
      gasPriceHistory,
      blockTimeHistory
    });
    setLoading(false);

    // In production, you would fetch real data here
    const interval = setInterval(() => {
      const newTimestamp = Math.floor(Date.now() / 1000);
      setStats(prev => ({
        gasPriceHistory: [
          ...prev.gasPriceHistory.slice(1),
          {
            timestamp: newTimestamp,
            price: 0.00000122 + (Math.random() - 0.5) * 0.00000010
          }
        ],
        blockTimeHistory: [
          ...prev.blockTimeHistory.slice(1),
          {
            timestamp: newTimestamp,
            time: 5 + (Math.random() - 0.5) * 2
          }
        ]
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return { stats, loading };
}