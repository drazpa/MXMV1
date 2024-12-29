import { useState, useEffect } from 'react';
import { useSwapCalculator } from './useSwapCalculator';
import { useTokens } from './useTokens';
import { SwapQuoteData } from '../types/blockchain';

interface QuoteParams {
  fromToken: string;
  toToken: string;
  fromAmount: number;
  slippage: number;
}

export function useSwapQuote({ fromToken, toToken, fromAmount, slippage }: QuoteParams) {
  const [quote, setQuote] = useState<SwapQuoteData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { tokens } = useTokens(null, null);
  const { calculateSwap, validateSwapInput } = useSwapCalculator();

  useEffect(() => {
    if (!fromToken || !toToken || !fromAmount) {
      setQuote(null);
      setError(null);
      return;
    }

    setLoading(true);
    try {
      const fromTokenInfo = tokens.find(t => t.address === fromToken);
      const toTokenInfo = tokens.find(t => t.address === toToken);

      if (!fromTokenInfo || !toTokenInfo) {
        throw new Error('Invalid tokens');
      }

      // Validate swap parameters
      const validationError = validateSwapInput(
        fromTokenInfo,
        toTokenInfo,
        fromAmount.toString()
      );

      if (validationError) {
        throw new Error(validationError);
      }

      // Calculate swap amounts
      const result = calculateSwap(fromTokenInfo, toTokenInfo, fromAmount.toString());
      
      if (!result) {
        throw new Error('Failed to calculate swap');
      }

      const minimumReceived = result.toAmount * (1 - slippage / 100);

      setQuote({
        fromSymbol: fromTokenInfo.symbol,
        toSymbol: toTokenInfo.symbol,
        fromAmount,
        toAmount: result.toAmount,
        rate: result.rate,
        priceImpact: result.priceImpact,
        minimumReceived,
        fee: result.fee
      });
      setError(null);
    } catch (err) {
      console.error('Quote error:', err);
      setError(err instanceof Error ? err.message : 'Failed to get quote');
      setQuote(null);
    } finally {
      setLoading(false);
    }
  }, [fromToken, toToken, fromAmount, slippage, tokens, calculateSwap, validateSwapInput]);

  return { quote, loading, error };
}