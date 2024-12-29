import { useState, useCallback } from 'react';
import { ethers } from 'ethers';
import { convertMXMtoMINT as convertToMint, convertMINTtoMXM as convertToMXM } from '../utils/converter/transactions';
import { handleError } from '../utils/converter/errors';

export function useConverterContract(provider: ethers.BrowserProvider | null) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const convertMXMtoMINT = useCallback(async (amount: string) => {
    if (!provider) throw new Error('Provider not connected');
    setLoading(true);
    setError(null);

    try {
      const signer = await provider.getSigner();
      await convertToMint(signer, amount);
    } catch (err) {
      const error = handleError(err);
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [provider]);

  const convertMINTtoMXM = useCallback(async (amount: string) => {
    if (!provider) throw new Error('Provider not connected');
    setLoading(true);
    setError(null);

    try {
      const signer = await provider.getSigner();
      await convertToMXM(signer, amount);
    } catch (err) {
      const error = handleError(err);
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [provider]);

  return {
    convertMXMtoMINT,
    convertMINTtoMXM,
    loading,
    error
  };
}