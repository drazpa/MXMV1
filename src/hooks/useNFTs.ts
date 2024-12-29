import { useState, useEffect } from 'react';
import { useMetaMask } from './useMetaMask';
import { NFT } from '../types/blockchain';

const MOCK_NFTS: NFT[] = [
  {
    id: '1',
    name: 'Magic Wizard #1234',
    collection: 'MagicMint Collection',
    image: 'https://images.unsplash.com/photo-1618172193763-c511deb635ca?w=400&h=400&fit=crop',
    stats: {
      floorPrice: 2.5,
      volume: 1250
    },
    attributes: [
      { trait: 'Power', value: '520' },
      { trait: 'Earn %', value: '50' },
      { trait: 'Burn %', value: '0' },
      { trait: 'Rarity', value: 'Legendary' }
    ],
    history: [
      { type: 'Mint', price: 1.0, date: '2024-01-15' },
      { type: 'Transfer', price: 0, date: '2024-01-20' },
      { type: 'List', price: 2.5, date: '2024-01-25' }
    ]
  },
  {
    id: '2',
    name: 'Magic Dragon #5678',
    collection: 'MagicMint Collection',
    image: 'https://images.unsplash.com/photo-1618172193622-ae2d025f4032?w=400&h=400&fit=crop',
    stats: {
      floorPrice: 3.2,
      volume: 980
    },
    attributes: [
      { trait: 'Power', value: '480' },
      { trait: 'Earn %', value: '45' },
      { trait: 'Burn %', value: '5' },
      { trait: 'Rarity', value: 'Epic' }
    ],
    history: [
      { type: 'Mint', price: 1.0, date: '2024-01-10' },
      { type: 'Sale', price: 2.1, date: '2024-01-18' },
      { type: 'List', price: 3.2, date: '2024-01-22' }
    ]
  },
  {
    id: '3',
    name: 'Magic Phoenix #9012',
    collection: 'MagicMint Collection',
    image: 'https://images.unsplash.com/photo-1618172193622-ae2d025f4032?w=400&h=400&fit=crop',
    stats: {
      floorPrice: 1.8,
      volume: 750
    },
    attributes: [
      { trait: 'Power', value: '420' },
      { trait: 'Earn %', value: '40' },
      { trait: 'Burn %', value: '2' },
      { trait: 'Rarity', value: 'Rare' }
    ],
    history: [
      { type: 'Mint', price: 1.0, date: '2024-01-12' },
      { type: 'Sale', price: 1.5, date: '2024-01-19' },
      { type: 'List', price: 1.8, date: '2024-01-24' }
    ]
  },
  {
    id: '4',
    name: 'Magic Griffin #3456',
    collection: 'MagicMint Collection',
    image: 'https://images.unsplash.com/photo-1618172193763-c511deb635ca?w=400&h=400&fit=crop',
    stats: {
      floorPrice: 2.0,
      volume: 890
    },
    attributes: [
      { trait: 'Power', value: '460' },
      { trait: 'Earn %', value: '42' },
      { trait: 'Burn %', value: '3' },
      { trait: 'Rarity', value: 'Epic' }
    ],
    history: [
      { type: 'Mint', price: 1.0, date: '2024-01-14' },
      { type: 'Sale', price: 1.8, date: '2024-01-21' },
      { type: 'List', price: 2.0, date: '2024-01-23' }
    ]
  }
];

export function useNFTs() {
  const { provider, account } = useMetaMask();
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNFTs = async () => {
      if (!provider || !account) {
        setNfts([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        // In production, fetch from NFT API
        // For demo, return mock data
        setNfts(MOCK_NFTS);
      } catch (error) {
        console.error('Error fetching NFTs:', error);
        setNfts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchNFTs();
  }, [provider, account]);

  return { nfts, loading };
}