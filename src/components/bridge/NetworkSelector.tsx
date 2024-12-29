import React from 'react';
import { Network } from 'lucide-react';
import { useMetaMask } from '../../hooks/useMetaMask';

export function NetworkSelector() {
  const { networkDetails } = useMetaMask();

  return (
    <div className="bg-gray-800/30 p-4 rounded-lg">
      <div className="flex items-center gap-2 mb-2">
        <Network className="w-4 h-4 text-purple-400" />
        <span className="text-sm text-gray-400">From Network</span>
      </div>
      <p className="text-purple-400 font-medium">
        {networkDetails?.name || 'Unknown Network'}
      </p>
    </div>
  );
}