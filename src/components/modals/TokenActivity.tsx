import React from 'react';
import { History, ArrowRightLeft } from 'lucide-react';
import { TokenInfo } from '../../types/blockchain';
import { useTokenActivity } from '../../hooks/useTokenActivity';

interface Props {
  token: TokenInfo;
}

export function TokenActivity({ token }: Props) {
  const { activities, loading } = useTokenActivity(token.address);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-green-400 mb-4">Token Activity</h3>

      {loading ? (
        <div className="animate-pulse space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-20 bg-gray-800 rounded-lg"></div>
          ))}
        </div>
      ) : activities.length > 0 ? (
        <div className="space-y-4">
          {activities.map((activity) => (
            <div 
              key={activity.hash}
              className="p-4 bg-gray-800/30 rounded-lg border border-green-500/10"
            >
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-400">
                  {new Date(activity.timestamp * 1000).toLocaleString()}
                </span>
                <a
                  href={`https://etherscan.io/tx/${activity.hash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-400 hover:text-green-300 text-sm"
                >
                  View
                </a>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="text-gray-400">
                  From: <span className="text-green-400">{activity.from.slice(0, 8)}...</span>
                </div>
                <div className="text-gray-400">
                  To: <span className="text-green-400">{activity.to.slice(0, 8)}...</span>
                </div>
                <div className="col-span-2 text-gray-400">
                  Amount: <span className="text-green-400">{activity.value} {token.symbol}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-8">
          <ArrowRightLeft className="w-12 h-12 text-gray-600 mb-2" />
          <p className="text-gray-400">No recent activity</p>
        </div>
      )}
    </div>
  );
}