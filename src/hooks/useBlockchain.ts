import { useState, useCallback, useEffect } from 'react';
import { ethers } from 'ethers';
import { sanitizeRpcUrl } from '../utils/rpcUtils';
import { NetworkConfig, BlockData } from '../types/blockchain';
import { MOCK_DATA } from '../utils/mockData';

export function useBlockchain() {
  const [provider, setProvider] = useState<ethers.JsonRpcProvider | null>(null);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [gasPrice, setGasPrice] = useState<string | null>(MOCK_DATA.gasPrice);
  const [latestBlock, setLatestBlock] = useState<BlockData | null>(null);

  const connect = useCallback(async (config: NetworkConfig) => {
    try {
      setLoading(true);
      setError('');
      
      const { url, headers } = sanitizeRpcUrl(config.rpcUrl);
      const newProvider = new ethers.JsonRpcProvider({
        url,
        headers
      });
      
      const network = await newProvider.getNetwork();
      if (network.chainId !== BigInt(config.chainId)) {
        throw new Error('Chain ID mismatch');
      }

      // Get initial gas price
      const feeData = await newProvider.getFeeData();
      if (feeData.gasPrice) {
        setGasPrice(ethers.formatUnits(feeData.gasPrice, 'gwei'));
      }
      
      setProvider(newProvider);

      // Subscribe to new blocks
      newProvider.on('block', async (blockNumber) => {
        try {
          const block = await newProvider.getBlock(blockNumber);
          if (!block) return;

          setLatestBlock({
            number: Number(block.number),
            hash: block.hash,
            timestamp: Number(block.timestamp),
            transactions: block.transactions,
            gasUsed: block.gasUsed.toString(),
            miner: block.miner
          });

          // Update gas price every block
          const updatedFeeData = await newProvider.getFeeData();
          if (updatedFeeData.gasPrice) {
            setGasPrice(ethers.formatUnits(updatedFeeData.gasPrice, 'gwei'));
          }
        } catch (err) {
          console.error('Error processing new block:', err);
        }
      });

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to connect');
      setProvider(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Cleanup subscriptions
  useEffect(() => {
    return () => {
      if (provider) {
        provider.removeAllListeners('block');
      }
    };
  }, [provider]);

  return {
    provider,
    error,
    loading,
    gasPrice,
    latestBlock,
    connect
  };
}