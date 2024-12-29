import React from 'react';
import { QrCode, Copy, ExternalLink } from 'lucide-react';
import { useMetaMask } from '../hooks/useMetaMask';

interface Props {
  address: string;
}

export function ReceiveTokens({ address }: Props) {
  const { networkDetails } = useMetaMask();
  
  const copyAddress = () => {
    navigator.clipboard.writeText(address);
  };

  return (
    <div className="space-y-6">
      {/* QR Code */}
      <div className="flex items-center justify-center p-8 bg-gradient-to-r from-gray-800/30 to-gray-900/30 rounded-lg border border-green-500/10">
        <div className="p-4 bg-white rounded-lg">
          <QrCode className="w-32 h-32 text-gray-900" />
        </div>
      </div>

      {/* Address Section */}
      <div className="space-y-2">
        <label className="block text-sm text-gray-400">Your Wallet Address</label>
        <div className="flex items-center gap-2">
          <code className="flex-1 text-sm text-green-400 bg-gray-900/50 rounded px-3 py-2 font-mono truncate">
            {address}
          </code>
          <button
            onClick={copyAddress}
            className="p-2 text-gray-400 hover:text-green-400 transition-colors"
            title="Copy Address"
          >
            <Copy className="w-4 h-4" />
          </button>
          {networkDetails?.blockExplorer && (
            <a
              href={`${networkDetails.blockExplorer}/address/${address}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-gray-400 hover:text-green-400 transition-colors"
              title="View on Explorer"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>

      {/* Network Info */}
      <div className="bg-gradient-to-r from-gray-800/30 to-gray-900/30 p-4 rounded-lg border border-green-500/10">
        <p className="text-sm text-gray-400 mb-2">Network</p>
        <div className="flex items-center justify-between">
          <span className="text-green-400">{networkDetails?.name || 'Unknown Network'}</span>
          <span className="px-2 py-1 bg-green-500/10 rounded-full text-xs text-green-400">
            Chain ID: {networkDetails?.chainId || '0'}
          </span>
        </div>
      </div>

      {/* Instructions */}
      <div className="text-sm text-gray-400">
        <p>Send only {networkDetails?.nativeCurrency.symbol || 'tokens'} to this address. Sending other assets may result in permanent loss.</p>
      </div>
    </div>
  );
}