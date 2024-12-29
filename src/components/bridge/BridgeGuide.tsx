import React from 'react';
import { Info, ArrowRight, Clock } from 'lucide-react';

export function BridgeGuide() {
  return (
    <div className="bg-purple-500/10 rounded-lg p-4 border border-purple-500/20">
      <div className="flex items-start gap-2">
        <Info className="w-5 h-5 text-purple-400 mt-0.5" />
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-purple-400">
            How to Bridge MXM to Polygon
          </h3>
          
          <div className="space-y-2">
            <h4 className="text-sm text-purple-400">Step 1: Initiate Bridge</h4>
            <ul className="text-sm text-gray-400 list-disc list-inside space-y-1">
              <li>Enter the amount of MXM you want to bridge</li>
              <li>Click "Bridge to Polygon"</li>
              <li>Confirm the transaction in your wallet</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm text-purple-400">Step 2: Wait for Confirmation</h4>
            <ul className="text-sm text-gray-400 list-disc list-inside space-y-1">
              <li>Wait 10-30 minutes for processing</li>
              <li>Transaction needs multiple confirmations</li>
              <li>Status updates will appear in the UI</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm text-purple-400">Step 3: Claim on Polygon</h4>
            <ul className="text-sm text-gray-400 list-disc list-inside space-y-1">
              <li>Switch your wallet to Polygon network</li>
              <li>Visit the claim portal at bridge.magicmint.xyz</li>
              <li>Connect your wallet</li>
              <li>Click "Claim" next to your pending transaction</li>
              <li>Confirm the claim transaction</li>
            </ul>
          </div>

          <div className="flex items-center gap-2 mt-4 text-sm text-purple-400">
            <Clock className="w-4 h-4" />
            <span>Average completion time: 10-30 minutes</span>
          </div>
        </div>
      </div>
    </div>
  );
}