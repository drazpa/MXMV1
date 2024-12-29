import React from 'react';
import { Fuel } from 'lucide-react';

interface Props {
  gasPrice: string | null;
}

export function GasTracker({ gasPrice }: Props) {
  if (!gasPrice) return null;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <div className="flex items-center gap-2 mb-2">
        <Fuel className="w-5 h-5 text-blue-500" />
        <h2 className="text-xl font-semibold">Current Gas Price</h2>
      </div>
      <div className="text-2xl font-bold text-gray-700">
        {gasPrice} Gwei
      </div>
    </div>
  );
}