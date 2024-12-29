import React from 'react';
import { Settings, LogOut, Copy, ExternalLink } from 'lucide-react';

interface Props {
  account: string;
  onDisconnect: () => void;
  blockExplorer?: string;
}

export function WalletOptions({ account, onDisconnect, blockExplorer }: Props) {
  const copyAddress = () => {
    navigator.clipboard.writeText(account);
  };

  return (
    <div className="space-y-2">
      <button
        onClick={copyAddress}
        className="w-full flex items-center gap-2 px-4 py-2 text-left text-gray-300 hover:bg-gray-800 rounded-md"
      >
        <Copy className="w-4 h-4" />
        Copy Address
      </button>
      
      {blockExplorer && (
        <a
          href={`${blockExplorer}/address/${account}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex items-center gap-2 px-4 py-2 text-left text-gray-300 hover:bg-gray-800 rounded-md"
        >
          <ExternalLink className="w-4 h-4" />
          View on Explorer
        </a>
      )}
      
      <button
        onClick={onDisconnect}
        className="w-full flex items-center gap-2 px-4 py-2 text-left text-red-400 hover:bg-gray-800 rounded-md"
      >
        <LogOut className="w-4 h-4" />
        Disconnect
      </button>
    </div>
  );
}