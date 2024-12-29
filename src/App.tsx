import React from 'react';
import { useBlockchain } from './hooks/useBlockchain';
import { useMetaMask } from './hooks/useMetaMask';
import { WalletConnect } from './components/WalletConnect';
import { NetworkForm } from './components/NetworkForm';
import { BlockExplorer } from './components/BlockExplorer';
import { AddressLookup } from './components/AddressLookup';
import { TokenBurner } from './components/TokenBurner';
import { TokenConverter } from './components/TokenConverter';
import { PriceDisplay } from './components/PriceDisplay';
import { BridgeContainer } from './components/bridge/BridgeContainer';

function App() {
  const {
    provider: customProvider,
    error,
    loading,
    gasPrice,
    connect: connectCustom,
    getLatestBlock,
    getTransaction,
    getBalance
  } = useBlockchain();

  const { provider: metaMaskProvider } = useMetaMask();
  const activeProvider = metaMaskProvider || customProvider;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black">
      <div className="container mx-auto px-4 py-8 space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-green-400">
            MagicMint (MXM)
          </h1>
          <p className="text-xl text-gray-400">
            L1 Blockchain Explorer
          </p>
        </div>

        {activeProvider && <PriceDisplay />}

        <div className="space-y-8">
          {activeProvider && (
            <BlockExplorer
              getLatestBlock={getLatestBlock}
              getTransaction={getTransaction}
              gasPrice={gasPrice}
            />
          )}

          <WalletConnect />

          {activeProvider && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <TokenConverter />
              <TokenBurner />
            </div>
          )}

          {!metaMaskProvider && (
            <NetworkForm onConnect={connectCustom} loading={loading} />
          )}

          {error && (
            <div className="p-4 bg-gradient-to-r from-gray-900 to-black text-red-400 rounded-lg border border-red-500/20">
              {error}
            </div>
          )}

          {activeProvider && (
            <AddressLookup getBalance={getBalance} />
          )}

          {/* Bridge Component */}
          {activeProvider && (
            <BridgeContainer />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;