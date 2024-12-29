import React from 'react';
import { ArrowRightLeft, Hash } from 'lucide-react';
import { TransactionData } from '../types/blockchain';

interface Props {
  getTransaction: (hash: string) => Promise<TransactionData | null>;
}

export function TransactionList({ getTransaction }: Props) {
  return (
    <div className="bg-gradient-to-b from-gray-900 to-black p-6 rounded-lg shadow-xl border border-green-500/20">
      <h2 className="text-xl font-semibold text-green-400 mb-4 flex items-center gap-2">
        <Hash className="w-5 h-5" />
        Recent Transactions
      </h2>
      <div className="flex items-center justify-center h-48 bg-gradient-to-r from-gray-800/50 to-gray-900/50 rounded-lg border border-green-500/10">
        <div className="text-center text-gray-400">
          <ArrowRightLeft className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p>No transactions yet</p>
        </div>
      </div>
    </div>
  );
}