import React from 'react';
import { Copy, ExternalLink, Shield } from 'lucide-react';
import { TokenInfo } from '../types/blockchain';

interface Props {
  token: TokenInfo;
}

export function TokenContractRow({ token }: Props) {
  const copyAddress = () => {
    navigator.clipboard.writeText(token.address);
  };

  return (
    <div className="mb-4">
      <div className="bg-gray-800/30 rounded-lg p-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-gray-400">Contract Address</span>
          <div className="flex items-center gap-2">
            <span className="text-xs px-2 py-0.5 bg-green-500/10 rounded-full text-green-400">
              Verified
            </span>
            <Shield className="w-4 h-4 text-green-400" />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <code className="text-xs text-green-400 bg-gray-900/50 rounded px-2 py-1 flex-1 font-mono truncate">
            {token.address}
          </code>
          <button
            onClick={copyAddress}
            className="p-1.5 text-gray-400 hover:text-green-400 transition-colors"
            title="Copy Address"
          >
            <Copy className="w-4 h-4" />
          </button>
          <a
            href={`https://etherscan.io/token/${token.address}`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 text-gray-400 hover:text-green-400 transition-colors"
            title="View on Explorer"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
}