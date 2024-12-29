import React, { useState } from 'react';
import { Wallet, ExternalLink } from 'lucide-react';
import { useMetaMask } from '../hooks/useMetaMask';
import { NetworkInfo } from './NetworkInfo';
import { WalletOptions } from './WalletOptions';
import { WalletDashboard } from './WalletDashboard';
import { WalletActions } from './WalletActions';

export function WalletConnect() {
  const { account, networkDetails, connect, disconnect, isInstalled } = useMetaMask();
  const [showOptions, setShowOptions] = useState(false);

  if (!isInstalled) {
    return (
      <div className="bg-gradient-to-b from-yellow-900/20 to-yellow-900/10 p-4 rounded-lg border border-yellow-500/20">
        <p className="text-yellow-400">
          MetaMask is not installed. Please install MetaMask to use this feature.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-gradient-to-b from-gray-900 to-black p-6 rounded-lg shadow-xl border border-green-500/20">
        {/* Wallet Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Wallet className="w-5 h-5 text-green-400" />
            <h2 className="text-xl font-semibold text-green-400">Wallet Connection</h2>
          </div>
          
          {!account ? (
            <button
              onClick={connect}
              className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 ring-offset-gray-900"
            >
              Connect MetaMask
            </button>
          ) : (
            <div className="relative">
              <button
                onClick={() => setShowOptions(!showOptions)}
                className="flex items-center gap-2 px-4 py-2 rounded-md border border-green-500/20 hover:bg-gray-800 text-green-400"
              >
                <span className="font-medium">
                  {account.slice(0, 6)}...{account.slice(-4)}
                </span>
              </button>
              
              {showOptions && (
                <div className="absolute right-0 mt-2 w-48 bg-gradient-to-b from-gray-900 to-black rounded-md shadow-lg border border-green-500/20 p-2 z-10">
                  <WalletOptions
                    account={account}
                    onDisconnect={disconnect}
                    blockExplorer={networkDetails?.blockExplorer}
                  />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Account and Explorer Info */}
        {account && networkDetails && (
          <div className="mt-4 grid gap-4">
            {/* Account Info */}
            <div className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 p-4 rounded-lg border border-green-500/10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Connected Account</p>
                  <p className="text-green-400 font-mono">{account}</p>
                </div>
                <button
                  onClick={() => navigator.clipboard.writeText(account)}
                  className="p-2 text-gray-400 hover:text-green-400 transition-colors"
                >
                  Copy
                </button>
              </div>
            </div>

            {/* Block Explorer Link */}
            {networkDetails.blockExplorer && (
              <div className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 p-4 rounded-lg border border-green-500/10">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Block Explorer</p>
                    <p className="text-green-400">{networkDetails.name} Explorer</p>
                  </div>
                  <a
                    href={`${networkDetails.blockExplorer}/address/${account}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-3 py-1.5 bg-green-500/10 text-green-400 rounded-md hover:bg-green-500/20 transition-colors"
                  >
                    View
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            )}

            {/* Send/Receive Actions */}
            <WalletActions />
          </div>
        )}
      </div>

      {account && networkDetails && (
        <>
          <NetworkInfo networkDetails={networkDetails} />
          <WalletDashboard />
        </>
      )}
    </div>
  );
}