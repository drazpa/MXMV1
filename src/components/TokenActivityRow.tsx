import React from 'react';
import { History } from 'lucide-react';
import { TokenInfo } from '../types/blockchain';
import { useTokenActivity } from '../hooks/useTokenActivity';

interface Props {
  token: TokenInfo;
}

export function TokenActivityRow({ token }: Props) {
  const { activities, loading } = useTokenActivity(token.address);

  return (
    <div className="bg-gray-800/30 rounded-lg p-3">
      <div className="flex items-center gap-2 mb-2">
        <History className="w-4 h-4 text-green-400" />
        <span className="text-xs text-gray-400">Recent Activity</span>
      </div>
      
      <div className="space-y-2">
        {loading ? (
          <div className="space-y-2">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="h-8 bg-gray-800 animate-pulse rounded" />
            ))}
          </div>
        ) : activities.slice(0, 2).map((activity) => (
          <div 
            key={activity.hash}
            className="flex items-center justify-between text-xs"
          >
            <div className="flex items-center gap-2">
              <span className="text-gray-400">
                {new Date(activity.timestamp * 1000).toLocaleString()}
              </span>
              <span className="text-green-400">
                {activity.value} {token.symbol}
              </span>
            </div>
            <a
              href={`https://etherscan.io/tx/${activity.hash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-400 hover:text-green-300"
            >
              View
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}