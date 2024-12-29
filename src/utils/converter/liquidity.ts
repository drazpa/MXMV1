import { ethers } from 'ethers';
import { LIQUIDITY_PROVIDER } from './constants';
import { rateLimiter } from './rateLimit';
import { ConversionError } from './errors';

export async function checkLiquidity(
  provider: ethers.Provider,
  fromToken: string,
  amount: string
): Promise<boolean> {
  try {
    if (fromToken === 'MXM') {
      const [balance, mintBalance] = await Promise.all([
        rateLimiter.enqueue(() => provider.getBalance(LIQUIDITY_PROVIDER)),
        rateLimiter.enqueue(() => {
          const mintContract = new ethers.Contract(
            '0x961d79c237601Bf1884908AECB3D2EB2f28B50f2',
            ['function balanceOf(address) view returns (uint256)'],
            provider
          );
          return mintContract.balanceOf(LIQUIDITY_PROVIDER);
        })
      ]);

      const requiredMint = ethers.parseEther(amount).mul(2);
      return mintBalance >= requiredMint;
    } else {
      const mintContract = new ethers.Contract(
        '0x961d79c237601Bf1884908AECB3D2EB2f28B50f2',
        ['function balanceOf(address) view returns (uint256)'],
        provider
      );
      
      const mintBalance = await rateLimiter.enqueue(() => 
        mintContract.balanceOf(LIQUIDITY_PROVIDER)
      );
      const requiredMint = ethers.parseEther(amount);
      return mintBalance >= requiredMint;
    }
  } catch (err) {
    throw new ConversionError('Failed to check liquidity', err);
  }
}