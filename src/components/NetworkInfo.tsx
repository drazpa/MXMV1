import React from 'react';
import { Network } from 'lucide-react';
import { NetworkDetails } from '../types/blockchain';

interface Props {
  networkDetails: NetworkDetails | null;
}

export function NetworkInfo({ networkDetails }: Props) {
  if (!networkDetails) return null;

  return (
    <div className="bg-gradient-to-b from-gray-900 to-black p-6 rounded-lg shadow-xl border border-green-500/20">
      <div className="flex items-center gap-2 mb-4">
        <Network className="w-5 h-5 text-green-400" />
        <h2 className="text-xl font-semibold text-green-400">Network Details</h2>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-gray-400">Network Name</p>
          <p className="font-medium text-green-400">{networkDetails.name}</p>
        </div>
        <div>
          <p className="text-sm text-gray-400">Chain ID</p>
          <p className="font-medium text-green-400">{networkDetails.chainId}</p>
        </div>
        <div>
          <p className="text-sm text-gray-400">Currency</p>
          <p className="font-medium text-green-400">{networkDetails.nativeCurrency.symbol}</p>
        </div>
        <div>
          <p className="text-sm text-gray-400">Block Explorer</p>
          <a 
            href={networkDetails.blockExplorer} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-green-400 hover:text-green-300"
          >
            View Explorer
          </a>
        </div>
      </div>
    </div>
  );
}