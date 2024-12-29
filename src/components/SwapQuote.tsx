import React from 'react';
import { ArrowRight, AlertCircle } from 'lucide-react';
import { SwapQuoteData } from '../types/blockchain';

interface Props {
  quote: SwapQuoteData;
  estimatedGas?: string | null;
  gasPrice?: string | null;
}

export function SwapQuote({ quote, estimatedGas, gasPrice }: Props) {
  return (
    <div className="bg-gray-800/30 p-4 rounded-lg space-y-3">
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-400">Rate</span>
        <div className="flex items-center gap-2 text-green-400">
          <span>1 {quote.fromSymbol}</span>
          <ArrowRight className="w-4 h-4" />
          <span>{quote.rate.toFixed(6)} {quote.toSymbol}</span>
        </div>
      </div>

      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-400">Price Impact</span>
        <span className={quote.priceImpact < 5 ? 'text-green-400' : 'text-red-400'}>
          {quote.priceImpact.toFixed(2)}%
        </span>
      </div>

      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-400">Network Fee</span>
        <div className="text-right">
          <span className="text-green-400">
            {estimatedGas ? `${Number(estimatedGas).toFixed(6)} MXM` : 'Calculating...'}
          </span>
          {gasPrice && (
            <div className="text-xs text-gray-400">
              Gas Price: {Number(gasPrice).toFixed(2)} Gwei
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-400">Minimum Received</span>
        <span className="text-green-400">
          {quote.minimumReceived.toFixed(6)} {quote.toSymbol}
        </span>
      </div>

      {quote.priceImpact >= 5 && (
        <div className="flex items-center gap-2 text-sm text-yellow-400 bg-yellow-400/10 p-2 rounded">
          <AlertCircle className="w-4 h-4" />
          <span>High price impact! You may get significantly less tokens.</span>
        </div>
      )}
    </div>
  );
}