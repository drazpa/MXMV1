import React, { useState } from 'react';
import { Image, ImageOff, Info } from 'lucide-react';
import { useNFTs } from '../hooks/useNFTs';
import { NFTModal } from './modals/NFTModal';

export function NFTGallery() {
  const { nfts, loading } = useNFTs();
  const [selectedNFT, setSelectedNFT] = useState<NFT | null>(null);

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="aspect-square bg-gray-800 animate-pulse rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Image className="w-5 h-5 text-green-400" />
        <h2 className="text-xl font-semibold text-green-400">NFT Collection</h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {nfts.map((nft) => (
          <div 
            key={nft.id}
            onClick={() => setSelectedNFT(nft)}
            className="group bg-gradient-to-r from-gray-800/50 to-gray-900/50 rounded-lg border border-green-500/10 overflow-hidden hover:border-green-500/30 transition-all cursor-pointer relative"
          >
            <div className="aspect-square overflow-hidden">
              <img 
                src={nft.image} 
                alt={nft.name}
                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <Info className="w-5 h-5 text-green-400" />
                </div>
              </div>
            </div>
            <div className="p-3">
              <h3 className="text-green-400 font-medium truncate">{nft.name}</h3>
              <p className="text-sm text-gray-400 truncate">{nft.collection}</p>
            </div>
          </div>
        ))}
      </div>

      {selectedNFT && (
        <NFTModal 
          nft={selectedNFT} 
          onClose={() => setSelectedNFT(null)} 
        />
      )}
    </div>
  );
}