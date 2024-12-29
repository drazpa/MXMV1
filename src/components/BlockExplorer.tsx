import React from 'react';
import { TransactionList } from './TransactionList';
import { NetworkStats } from './NetworkStats';
import { MOCK_DATA } from '../utils/mockData';

interface Props {
  getLatestBlock: () => Promise<BlockData | null>;
  getTransaction: (hash: string) => Promise<TransactionData | null>;
  gasPrice: string | null;
}

export function BlockExplorer({ getLatestBlock, getTransaction, gasPrice }: Props) {
  // Use mock data if no real data available
  const currentGasPrice = gasPrice || MOCK_DATA.networkStats.gasPrice;
  const currentBlockTime = MOCK_DATA.networkStats.blockTime;

  return (
    <div className="space-y-8">
      <NetworkStats 
        gasPrice={currentGasPrice}
        blockTime={currentBlockTime}
      />

      <div className="w-full">
        <TransactionList getTransaction={getTransaction} />
      </div>
    </div>
  );
}