import React from 'react';
import { usePriceOracle } from '../hooks/usePriceOracle';
import { useMetaMask } from '../hooks/useMetaMask';
import { TWAPDisplay } from './TWAPDisplay';
import { VolumeDisplay } from './VolumeDisplay';
import { useTWAPHistory } from '../hooks/useTWAPHistory';

export function PriceDisplay() {
  const { provider } = useMetaMask();
  const { getTWAP, getMXMTWAP } = usePriceOracle(provider);
  const [mintTWAP, setMintTWAP] = React.useState<number | null>(null);
  const [mxmTWAP, setMXMTWAP] = React.useState<number | null>(null);

  const { history: mintTWAPHistory } = useTWAPHistory('MINT', mintTWAP);
  const { history: mxmTWAPHistory } = useTWAPHistory('MXM', mxmTWAP);

  React.useEffect(() => {
    const fetchTWAPs = async () => {
      try {
        const [currentMintTWAP, currentMXMTWAP] = await Promise.all([
          getTWAP(),
          getMXMTWAP()
        ]);
        
        setMintTWAP(currentMintTWAP);
        setMXMTWAP(currentMXMTWAP);
      } catch (error) {
        console.error('Error fetching TWAPs:', error);
      }
    };

    fetchTWAPs();
    const interval = setInterval(fetchTWAPs, 30000);
    return () => clearInterval(interval);
  }, [getTWAP, getMXMTWAP]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TWAPDisplay 
          symbol="MXM"
          currentTWAP={mxmTWAP} 
          twapHistory={mxmTWAPHistory} 
        />
        <TWAPDisplay 
          symbol="MINT"
          currentTWAP={mintTWAP}
          twapHistory={mintTWAPHistory} 
        />
      </div>
      <VolumeDisplay />
    </div>
  );
}