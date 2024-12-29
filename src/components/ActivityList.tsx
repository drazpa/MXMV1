import React from 'react';
import { History, ArrowRightLeft } from 'lucide-react';
import { TransactionActivity } from '../types/blockchain';

interface Props {
  activities: TransactionActivity[];
  loading: boolean;
  blockExplorer?: string;
}

export function ActivityList({ activities, loading, blockExplorer }: Props) {
  if (loading) {
    return (
      <div className="bg-gradient-to-b from-gray-900 to-black p-6 rounded-lg shadow-xl border border-green-500/20">
        <div className="flex items-center gap-2 mb-4">
          <History className="w-5 h-5 text-green-400" />
          <h2 className="text-xl font-semibold text-green-400">Recent Activity</h2>
        </div>
        <div className="animate-pulse space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-24 bg-gray-800 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-gray-900 to-black p-6 rounded-lg shadow-xl border border-green-500/20">
      <div className="flex items-center gap-2 mb-4">
        <History className="w-5 h-5 text-green-400" />
        <h2 className="text-xl font-semibold text-green-400">Recent Activity</h2>
      </div>

      {activities.length > 0 ? (
        <div className="space-y-4">
          {activities.map((activity) => (
            <div 
              key={activity.hash} 
              className="p-4 bg-gradient-to-r from-gray-800/50 to-gray-900/50 rounded-lg border border-green-500/10 hover:border-green-500/30 transition-colors"
            >
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-green-400">
                  {new Date(activity.timestamp * 1000).toLocaleString()}
                </span>
                {blockExplorer && (
                  <a
                    href={`${blockExplorer}/tx/${activity.hash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-400 hover:text-green-300 text-sm"
                  >
                    View
                  </a>
                )}
              </div>
              <div className="grid grid-cols-1 gap-2 text-sm">
                <div className="text-gray-400">
                  From: <span className="text-green-400 font-medium">{activity.from}</span>
                </div>
                <div className="text-gray-400">
                  To: <span className="text-green-400 font-medium">{activity.to}</span>
                </div>
                <div className="text-gray-400">
                  Amount: <span className="text-green-400 font-medium">{activity.value} MXM</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-8 bg-gradient-to-r from-gray-800/50 to-gray-900/50 rounded-lg border border-green-500/10">
          <ArrowRightLeft className="w-12 h-12 text-gray-600 mb-2" />
          <p className="text-gray-400">No recent activity</p>
        </div>
      )}
    </div>
  );
}