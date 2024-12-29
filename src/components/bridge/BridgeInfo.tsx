import React from 'react';
import { Info } from 'lucide-react';

export function BridgeInfo() {
  return (
    <div className="bg-purple-500/10 rounded-lg p-4 border border-purple-500/20">
      <div className="flex items-start gap-2">
        <Info className="w-5 h-5 text-purple-400 mt-0.5" />
        <div className="space-y-1">
          <p className="text-sm text-purple-400">Bridge Information</p>
          <ul className="text-sm text-gray-400 list-disc list-inside space-y-1">
            <li>Bridge fee: 0.5%</li>
            <li>Average completion time: 10-30 minutes</li>
            <li>Minimum amount: 0.1 tokens</li>
          </ul>
        </div>
      </div>
    </div>
  );
}