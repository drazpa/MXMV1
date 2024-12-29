import React, { useState, useEffect } from 'react';
import { Settings, ArrowDownUp } from 'lucide-react';
import { useMetaMask } from '../hooks/useMetaMask';
import { useTokens } from '../hooks/useTokens';
import { useSwapQuote } from '../hooks/useSwapQuote';
import { useGasFees } from '../hooks/useGasFees';
import { useSwapContract } from '../hooks/useSwapContract';
import { TokenSwapInput } from './TokenSwapInput';
import { SwapQuote } from './SwapQuote';
import { SwapSettings } from './SwapSettings';

export function TokenSwap() {
  const { provider, account } = useMetaMask();
  const { tokens } = useTokens(provider, account);
  const [fromToken, setFromToken] = useState('');
  const [toToken, setToToken] = useState('');
  const [fromAmount, setFromAmount] = useState('');
  const [slippage, setSlippage] = useState(0.5);
  const [showSettings, setShowSettings] = useState(false);

  const { estimatedGas, estimateGasFees } = useGasFees();
  const { quote, loading: quoteLoading, error: quoteError } = useSwapQuote({
    fromToken,
    toToken,
    fromAmount: parseFloat(fromAmount) || 0,
    slippage,
    estimatedGas
  });

  const { executeSwap, loading: swapLoading, error: swapError } = useSwapContract(provider);

  useEffect(() => {
    if (fromToken && toToken && fromAmount) {
      estimateGasFees(fromToken, toToken, fromAmount);
    }
  }, [fromToken, toToken, fromAmount, estimateGasFees]);

  const handleSwitch = () => {
    setFromToken(toToken);
    setToToken(fromToken);
    setFromAmount('');
  };

  const handleSwap = async () => {
    if (!quote || !provider || !account) return;

    try {
      const fromTokenInfo = tokens.find(t => t.address === fromToken);
      const toTokenInfo = tokens.find(t => t.address === toToken);
      
      if (!fromTokenInfo || !toTokenInfo) {
        throw new Error('Invalid token selection');
      }

      await executeSwap(
        fromTokenInfo,
        toTokenInfo,
        fromAmount,
        quote.minimumReceived.toString(),
        slippage
      );

      // Reset form after successful swap
      setFromAmount('');
    } catch (error) {
      console.error('Swap failed:', error);
    }
  };

  // Determine button state and text
  const getButtonState = () => {
    if (!account) return { text: 'Connect Wallet', disabled: true };
    if (!fromToken || !toToken) return { text: 'Select Tokens', disabled: true };
    if (!fromAmount) return { text: 'Enter Amount', disabled: true };
    if (quoteLoading) return { text: 'Calculating...', disabled: true };
    if (swapLoading) return { text: 'Swapping...', disabled: true };
    if (quoteError) return { text: quoteError, disabled: true };
    if (swapError) return { text: swapError, disabled: true };

    // Check if it's a native token swap and validate balance including gas
    const fromTokenInfo = tokens.find(t => t.address === fromToken);
    if (fromTokenInfo?.standard === 'NATIVE' && estimatedGas) {
      const totalNeeded = parseFloat(fromAmount) + parseFloat(estimatedGas);
      const balance = parseFloat(fromTokenInfo.balance || '0');
      if (totalNeeded > balance) {
        return { text: 'Insufficient balance for gas', disabled: true };
      }
    }

    return { text: 'Swap', disabled: false };
  };

  const buttonState = getButtonState();

  return (
    <div className="bg-gradient-to-b from-gray-900 to-black p-6 rounded-lg shadow-xl border border-green-500/20">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-green-400">Swap Tokens</h2>
        <button
          onClick={() => setShowSettings(true)}
          className="p-2 text-gray-400 hover:text-green-400 transition-colors rounded-lg hover:bg-gray-800"
        >
          <Settings className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-4">
        <TokenSwapInput
          label="From"
          tokens={tokens}
          selectedToken={fromToken}
          onSelectToken={setFromToken}
          amount={fromAmount}
          onAmountChange={setFromAmount}
          disabledTokens={[toToken]}
        />

        <div className="flex justify-center -my-2">
          <button
            onClick={handleSwitch}
            className="p-2 bg-gray-800 rounded-full hover:bg-gray-700 transition-colors"
          >
            <ArrowDownUp className="w-5 h-5 text-green-400" />
          </button>
        </div>

        <TokenSwapInput
          label="To"
          tokens={tokens}
          selectedToken={toToken}
          onSelectToken={setToToken}
          amount={quote?.toAmount.toString() || ''}
          readOnly
          disabledTokens={[fromToken]}
        />

        {quote && (
          <SwapQuote quote={quote} estimatedGas={estimatedGas} />
        )}

        <button
          onClick={handleSwap}
          disabled={buttonState.disabled}
          className="w-full bg-green-500 text-white py-3 px-4 rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {buttonState.text}
        </button>
      </div>

      {showSettings && (
        <SwapSettings
          slippage={slippage}
          onSlippageChange={setSlippage}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  );
}