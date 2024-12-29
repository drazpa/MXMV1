import React from 'react';
import { BarChart2 } from 'lucide-react';
import { useTokenVolume } from '../hooks/useTokenVolume';
import { usePriceOracle } from '../hooks/usePriceOracle';
import { useMetaMask } from '../hooks/useMetaMask';

const TOKENS = {
  MXM: {
    address: 'native',
    symbol: 'MXM'
  },
  MINT: {
    address: '0x961d79c237601Bf1884908AECB3D2EB2f28B50f2',
    symbol: 'MINT'
  }
};

export function VolumeDisplay() {
  const { provider } = useMetaMask();
  const { getPrice, getMXMPrice } = usePriceOracle(provider);
  const [prices, setPrices] = React.useState({ MXM: 0, MINT: 0 });

  const { volume24h: mxmVolume, loading: mxmLoading } = useTokenVolume(TOKENS.MXM.address);
  const { volume24h: mintVolume, loading: mintLoading } = useTokenVolume(TOKENS.MINT.address);

  React.useEffect(() => {
    const fetchPrices = async () => {
      const [mintPrice, mxmPrice] = await Promise.all([
        getPrice(),
        getMXMPrice()
      ]);
      setPrices({ MINT: mintPrice, MXM: mxmPrice });
    };

    fetchPrices();
    const interval = setInterval(fetchPrices, 30000);
    return () => clearInterval(interval);
  }, [getPrice, getMXMPrice]);

  const volumeData = [
    {
      symbol: 'MXM',
      tokenVolume: mxmVolume,
      usdVolume: mxmVolume * prices.MXM,
      loading: mxmLoading
    },
    {
      symbol: 'MINT',
      tokenVolume: mintVolume,
      usdVolume: mintVolume * prices.MINT,
      loading: mintLoading
    }
  ];

  return (
    <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-black p-6 rounded-xl shadow-xl border border-green-500/20 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <BarChart2 className="w-5 h-5 text-green-400" />
        <h2 className="text-xl font-semibold text-green-400">24h Trading Volume</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left text-gray-400">
              <th className="pb-2">Token</th>
              <th className="pb-2 text-right">Volume (Tokens)</th>
              <th className="pb-2 text-right">Volume (USD)</th>
            </tr>
          </thead>
          <tbody>
            {volumeData.map(({ symbol, tokenVolume, usdVolume, loading }) => (
              <tr key={symbol} className="border-t border-green-500/10">
                <td className="py-3 text-green-400">{symbol}</td>
                <td className="py-3 text-right">
                  {loading ? (
                    <div className="h-4 w-24 bg-gray-800 animate-pulse rounded ml-auto" />
                  ) : (
                    <span className="text-gray-300">
                      {tokenVolume.toLocaleString(undefined, {
                        maximumFractionDigits: 2
                      })}
                    </span>
                  )}
                </td>
                <td className="py-3 text-right">
                  {loading ? (
                    <div className="h-4 w-24 bg-gray-800 animate-pulse rounded ml-auto" />
                  ) : (
                    <span className="text-gray-300">
                      ${usdVolume.toLocaleString(undefined, {
                        maximumFractionDigits: 2
                      })}
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}