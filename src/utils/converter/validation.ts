import { ethers } from 'ethers';
import { MINT_TOKEN_ADDRESS, MIN_AMOUNT } from './constants';
import { ConversionError } from './errors';
import { rateLimiter } from './rateLimit';
import { estimateGasCost, getTotalGasLimit } from './gas';

export async function validateConversion(
  provider: ethers.Provider,
  tokenType: 'MXM' | 'MINT',
  amount: string
): Promise<void> {
  if (!amount || isNaN(Number(amount))) {
    throw new ConversionError('Please enter a valid amount');
  }

  if (Number(amount) < Number(MIN_AMOUNT)) {
    throw new ConversionError(`Minimum amount is ${MIN_AMOUNT} tokens`);
  }

  try {
    const signer = await provider.getSigner();
    const address = await rateLimiter.enqueue(() => signer.getAddress());
    const value = ethers.parseEther(amount);

    if (tokenType === 'MXM') {
      const balance = await rateLimiter.enqueue(() => 
        provider.getBalance(address)
      );
      
      const gasLimit = getTotalGasLimit('MXM_TO_MINT');
      const gasCost = estimateGasCost(gasLimit);
      const totalNeeded = value.add(ethers.parseEther(gasCost));
      
      if (balance < totalNeeded) {
        throw new ConversionError(
          `Insufficient MXM balance. Need ${ethers.formatEther(totalNeeded)} MXM (including ${gasCost} MXM gas)`
        );
      }
    } else {
      // Rest of the MINT validation remains the same
      const mintContract = new ethers.Contract(
        MINT_TOKEN_ADDRESS,
        ['function balanceOf(address) view returns (uint256)'],
        provider
      );
      
      const balance = await rateLimiter.enqueue(() => 
        mintContract.balanceOf(address)
      );
      
      if (balance < value) {
        throw new ConversionError(
          `Insufficient MINT balance. Have ${ethers.formatEther(balance)} MINT, need ${amount} MINT`
        );
      }
    }
  } catch (err) {
    if (err instanceof ConversionError) throw err;
    throw new ConversionError('Validation failed - please try again', err);
  }
}