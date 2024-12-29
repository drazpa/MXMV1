export interface BridgeStatus {
  id: string;
  fromChain: string;
  toChain: string;
  amount: string;
  token: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  txHash?: string;
  timestamp: number;
  estimatedCompletion?: number;
}

export interface BridgeTransaction {
  hash: string;
  status: 'pending' | 'confirmed' | 'failed';
  confirmations: number;
  requiredConfirmations: number;
}