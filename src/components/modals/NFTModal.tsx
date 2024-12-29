import React from 'react';
import { X, ExternalLink, Tag, BarChart2, Clock } from 'lucide-react';
import { NFT } from '../../types/blockchain';

interface Props {
  nft: NFT;
  onClose: () => void;
}

export function NFTModal({ nft, onClose }: Props) {
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-b from-gray-900 to-black rounded-xl shadow-2xl border border-green-500/20 w-full max-w-4xl overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b border-green-500/20">
          <h2 className="text-xl font-bold text-green-400">{nft.name}</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-green-400 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
          {/* Image */}
          <div className="space-y-4">
            <div className="aspect-square rounded-lg overflow-hidden border border-green-500/20">
              <img 
                src={nft.image} 
                alt={nft.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Collection</span>
              <span className="text-green-400">{nft.collection}</span>
            </div>
          </div>

          {/* Details */}
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-800/30 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Tag className="w-4 h-4 text-green-400" />
                  <span className="text-sm text-gray-400">Floor Price</span>
                </div>
                <span className="text-xl font-bold text-green-400">
                  {nft.stats.floorPrice} ETH
                </span>
              </div>
              
              <div className="bg-gray-800/30 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <BarChart2 className="w-4 h-4 text-green-400" />
                  <span className="text-sm text-gray-400">Volume</span>
                </div>
                <span className="text-xl font-bold text-green-400">
                  {nft.stats.volume} ETH
                </span>
              </div>
            </div>

            {/* Attributes */}
            <div>
              <h3 className="text-lg font-medium text-green-400 mb-3">Attributes</h3>
              <div className="grid grid-cols-2 gap-3">
                {nft.attributes.map((attr, i) => (
                  <div 
                    key={i}
                    className="bg-gray-800/30 rounded-lg p-3"
                  >
                    <span className="text-sm text-gray-400 block mb-1">
                      {attr.trait}
                    </span>
                    <span className="text-green-400 font-medium">
                      {attr.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* History */}
            <div>
              <h3 className="text-lg font-medium text-green-400 mb-3">History</h3>
              <div className="space-y-2">
                {nft.history.map((event, i) => (
                  <div 
                    key={i}
                    className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg"
                  >
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-400">
                        {event.type}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-green-400 block">
                        {event.price} ETH
                      </span>
                      <span className="text-sm text-gray-400">
                        {new Date(event.date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}