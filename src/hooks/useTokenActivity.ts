import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { TransactionActivity } from '../types/blockchain';
import { MOCK_DATA } from '../utils/mockData';

export function useTokenActivity(tokenAddress: string) {
  const [activities, setActivities] = useState<TransactionActivity[]>(MOCK_DATA.tokenActivity);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;

    const fetchActivity = async () => {
      if (!tokenAddress) {
        setActivities(MOCK_DATA.tokenActivity);
        return;
      }

      try {
        setLoading(true);
        
        // Skip ENS resolution entirely
        const filter = {
          address: tokenAddress,
          topics: [
            ethers.id("Transfer(address,address,uint256)")
          ],
          fromBlock: -1000
        };

        // Rest of activity fetching logic...
        
      } catch (error) {
        console.error('Error fetching token activity:', error);
        // Fallback to mock data
        if (mounted) {
          setActivities(MOCK_DATA.tokenActivity);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchActivity();
    return () => { mounted = false; };
  }, [tokenAddress]);

  return { activities, loading };
}