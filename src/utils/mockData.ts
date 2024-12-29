// Extended mock data
export const MOCK_DATA = {
  conversionRate: 2,
  gasPrice: '0.00000122',
  balance: '1000.0',
  latestBlock: {
    number: 12345678,
    hash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
    timestamp: Math.floor(Date.now() / 1000),
    transactions: [],
    gasUsed: '21000',
    miner: '0xabcdef1234567890abcdef1234567890abcdef12'
  },
  transaction: {
    hash: '0x9876543210fedcba9876543210fedcba9876543210fedcba9876543210fedcba',
    from: '0x1234567890123456789012345678901234567890',
    to: '0x0987654321098765432109876543210987654321',
    value: '10.5'
  },
  tokenActivity: [
    {
      hash: '0x123...', 
      from: '0x456...',
      to: '0x789...',
      value: '100',
      timestamp: Math.floor(Date.now() / 1000)
    }
  ],
  networkStats: {
    tps: 15.5,
    blockTime: '5',
    gasPrice: '0.00000122'
  }
};