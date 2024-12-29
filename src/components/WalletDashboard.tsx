import React from 'react';
import { useMetaMask } from '../hooks/useMetaMask';
import { useTokens } from '../hooks/useTokens';
import { useWalletActivity } from '../hooks/useWalletActivity';
import { TokenList } from './TokenList';
import { ActivityList } from './ActivityList';
import { NetworkStats } from './NetworkStats';
import { NFTGallery } from './NFTGallery';

export function WalletDashboard() {
  const { provider, account, networkDetails } = useMetaMask();
  const { tokens, loading: tokensLoading } = useTokens(provider, account);
  const { activities, loading: activitiesLoading } = useWalletActivity(provider, account);

  if (!account) return null;

  return (
    <div className="space-y-6">
      <NetworkStats 
        gasPrice="0.00000122"
        blockTime="5s"
      />
      
      <div>
        <TokenList tokens={tokens} loading={tokensLoading} />
      </div>
      
      <ActivityList 
        activities={activities} 
        loading={activitiesLoading}
        blockExplorer={networkDetails?.blockExplorer}
      />

      <NFTGallery />
    </div>
  );
}