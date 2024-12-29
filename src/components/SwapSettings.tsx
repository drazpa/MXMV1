import React from 'react';
import { X } from 'lucide-react';

interface Props {
  slippage: number;
  onSlippageChange: (value: number) => void;
  onClose: () => void;
}

export function SwapSettings({ slippage, onSlippageChange, onClose }: Props) {
  const presetSlippages = [0.1, 0.5, 1.0];

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-gradient-to-b from-gray-900 to-black p-6 rounded-xl border border-green-500/20 w-full max-w-md">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-green-400">Swap Settings</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-green-400 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-2">
              Slippage Tolerance
            </label>
            <div className="flex gap-2 mb-2">
              {presetSlippages.map(value => (
                <button
                  key={value}
                  onClick={() => onSlippageChange(value)}
                  className={`px-3 py-1 rounded-lg ${
                    slippage === value
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                  }`}
                >
                  {value}%
                </button>
              ))}
              <div className="relative flex-1">
                <input
                  type="number"
                  value={slippage}
                  onChange={e => onSlippageChange(parseFloat(e.target.value))}
                  className="w-full bg-gray-800 text-green-400 px-3 py-1 rounded-lg focus:outline-none focus:ring-1 focus:ring-green-500"
                  step="0.1"
                  min="0.1"
                  max="20"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  %
                </span>
              </div>
            </div>
            <p className="text-xs text-gray-500">
              Your transaction will revert if the price changes unfavorably by more than this percentage.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}