import { useState, useEffect } from 'react';
import { BridgeStatus, BridgeTransaction } from '../types/bridge';

export function useBridgeStatus(bridgeId?: string) {
  const [status, setStatus] = useState<BridgeStatus | null>(null);
  const [transaction, setTransaction] = useState<BridgeTransaction | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!bridgeId) return;

    const checkStatus = async () => {
      try {
        setLoading(true);
        // In production, fetch from bridge API
        // For demo, simulate status updates
        const mockStatus: BridgeStatus = {
          id: bridgeId,
          fromChain: 'MagicMint',
          toChain: 'Polygon',
          amount: '100',
          token: 'MXM',
          status: 'processing',
          txHash: '0x...',
          timestamp: Date.now(),
          estimatedCompletion: Date.now() + 900000 // 15 minutes
        };

        const mockTx: BridgeTransaction = {
          hash: '0x...',
          status: 'pending',
          confirmations: 3,
          requiredConfirmations: 10
        };

        setStatus(mockStatus);
        setTransaction(mockTx);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch status');
      } finally {
        setLoading(false);
      }
    };

    checkStatus();
    const interval = setInterval(checkStatus, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, [bridgeId]);

  return { status, transaction, loading, error };
}