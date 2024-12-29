import React from 'react';
import { ArrowRight } from 'lucide-react';
import { BridgeForm } from './BridgeForm';
import { BridgeGuide } from './BridgeGuide';

export function BridgeContainer() {
  return (
    <div className="bg-gradient-to-b from-gray-900 to-black p-6 rounded-lg shadow-xl border border-purple-500/20">
      <div className="flex items-center gap-2 mb-6">
        <ArrowRight className="w-5 h-5 text-purple-400" />
        <h2 className="text-xl font-semibold text-purple-400">Bridge to Polygon</h2>
      </div>

      <div className="space-y-6">
        <BridgeForm />
        <BridgeGuide />
      </div>
    </div>
  );
}