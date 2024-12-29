import React, { useState, useEffect } from 'react';
import { Clock, User } from 'lucide-react';
import { BlockData } from '../types/blockchain';
import { NetworkStatsCharts } from './charts/NetworkStatsCharts';

interface Props {
  getLatestBlock: () => Promise<BlockData | null>;
}

export function BlockList({ getLatestBlock }: Props) {
  const [blocks, setBlocks] = useState<BlockData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlocks = async () => {
      try {
        const latestBlock = await getLatestBlock();
        if (latestBlock) {
          setBlocks(prevBlocks => {
            if (prevBlocks.length === 0 || prevBlocks[0].number !== latestBlock.number) {
              return [latestBlock, ...prevBlocks].slice(0, 10);
            }
            return prevBlocks;
          });
        }
      } catch (error) {
        console.error('Error fetching blocks:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlocks();
    const interval = setInterval(fetchBlocks, 10000);
    return () => clearInterval(interval);
  }, [getLatestBlock]);

  return (
    <div className="space-y-6">
      <NetworkStatsCharts />
      
      <div className="bg-gradient-to-b from-gray-900 to-black p-6 rounded-lg shadow-xl border border-green-500/20">
        <h2 className="text-xl font-semibold text-green-400 mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5" />
          Latest Blocks
        </h2>
        <div className="space-y-4">
          {loading && blocks.length === 0 ? (
            <div className="text-center py-4 text-gray-400">Loading blocks...</div>
          ) : (
            blocks.map((block) => (
              <div 
                key={block.hash} 
                className="p-4 bg-gradient-to-r from-gray-800/50 to-gray-900/50 rounded-lg border border-green-500/10 hover:border-green-500/30 transition-colors"
              >
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="flex items-center gap-2 text-gray-400 mb-1">
                      <User className="w-4 h-4" />
                      <span className="text-sm">Miner</span>
                    </div>
                    <span className="text-green-400 text-sm truncate block">{block.miner}</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 text-gray-400 mb-1">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm">Time</span>
                    </div>
                    <span className="text-green-400 text-sm block">
                      {new Date(block.timestamp * 1000).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}