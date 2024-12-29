import { ethers } from 'ethers';
import { FormattedGasEstimate } from '../../types/gas';

export function formatGasEstimate(
  gasLimit: bigint,
  gasCost: bigint,
  gasPrice: bigint
): FormattedGasEstimate {
  return {
    gasLimit: gasLimit.toString(),
    gasCost: ethers.formatEther(gasCost),
    gasPrice: ethers.formatUnits(gasPrice, 'gwei')
  };
}