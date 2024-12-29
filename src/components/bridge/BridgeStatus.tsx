import React from 'react';
import { Clock, CheckCircle, XCircle, Loader } from 'lucide-react';
import { useBridgeStatus } from '../../hooks/useBridgeStatus';

interface Props {
  bridgeId: string;
}

export function BridgeStatus({ bridgeId }: Props) {
  const { status, transaction, loading } = useBridgeStatus(bridgeId);

  if (loading || !status) {
    return (
      <div className="flex items-center justify-center p-4">
        <Loader className="w-6 h-6 text-purple-400 animate-spin" />
      </div>
    );
  }

  const getStatusIcon = () => {
    switch (status.status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-400" />;
      default:
        return <Clock className="w-5 h-5 text-purple-400" />;
    }
  };

  const getTimeRemaining = () => {
    if (!status.estimatedCompletion) return null;
    const remaining = Math.max(0, status.estimatedCompletion - Date.now());
    const minutes = Math.ceil(remaining / 60000);
    return `~${minutes} minutes remaining`;
  };

  return (
    <div className="bg-purple-500/10 rounded-lg p-4 border border-purple-500/20">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          {getStatusIcon()}
          <span className="text-purple-400 font-medium">
            Bridge Status: {status.status.charAt(0).toUpperCase() + status.status.slice(1)}
          </span>
        </div>
        {transaction && (
          <span className="text-sm text-purple-400">
            {transaction.confirmations}/{transaction.requiredConfirmations} Confirmations
          </span>
        )}
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-400">Amount</span>
          <span className="text-purple-400">{status.amount} {status.token}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">From</span>
          <span className="text-purple-400">{status.fromChain}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">To</span>
          <span className="text-purple-400">{status.toChain}</span>
        </div>
        {status.status === 'processing' && (
          <div className="flex justify-between">
            <span className="text-gray-400">Estimated Time</span>
            <span className="text-purple-400">{getTimeRemaining()}</span>
          </div>
        )}
      </div>

      {status.status === 'completed' && (
        <div className="mt-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
          <p className="text-sm text-green-400">
            Bridge complete! Your tokens are now available on Polygon.
          </p>
        </div>
      )}

      {status.status === 'failed' && (
        <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
          <p className="text-sm text-red-400">
            Bridge failed. Please contact support if funds were deducted.
          </p>
        </div>
      )}
    </div>
  );
}