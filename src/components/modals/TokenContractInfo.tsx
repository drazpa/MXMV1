import React from 'react';
import { FileText, Copy, ExternalLink, Shield, Code } from 'lucide-react';
import { TokenInfo } from '../../types/blockchain';

interface Props {
  token: TokenInfo;
}

export function TokenContractInfo({ token }: Props) {
  const copyAddress = () => {
    navigator.clipboard.writeText(token.address);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-green-400">Contract Info</h3>
        <div className="flex items-center gap-2">
          <span className="text-xs px-2 py-1 bg-green-500/10 rounded-full text-green-400">
            Verified
          </span>
          <Shield className="w-4 h-4 text-green-400" />
        </div>
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm text-gray-400 mb-1">Contract Address</label>
          <div className="flex items-center gap-2">
            <code className="block text-sm text-green-400 bg-gray-900/50 rounded px-2 py-1 flex-1 font-mono truncate">
              {token.address}
            </code>
            <button
              onClick={copyAddress}
              className="p-2 text-gray-400 hover:text-green-400 transition-colors"
              title="Copy Address"
            >
              <Copy className="w-4 h-4" />
            </button>
            <a
              href={`https://etherscan.io/token/${token.address}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-gray-400 hover:text-green-400 transition-colors"
              title="View on Explorer"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Token Standard</label>
            <span className="text-green-400">ERC20</span>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Decimals</label>
            <span className="text-green-400">{token.decimals}</span>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Network</label>
            <span className="text-green-400">Ethereum</span>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Last Updated</label>
            <span className="text-green-400">
              {new Date().toLocaleDateString()}
            </span>
          </div>
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-1">Security</label>
          <div className="flex flex-wrap gap-2">
            {['Verified Source', 'Audited', 'Proxy: ERC1967'].map((tag) => (
              <span 
                key={tag}
                className="text-xs px-2 py-1 bg-green-500/10 rounded-full text-green-400"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}