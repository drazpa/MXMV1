import { ethers } from 'ethers';
import { LIQUIDITY_PROVIDER } from './constants';
import { ConversionError } from './errors';
import { rateLimiter } from './rateLimit';

export async function checkAndApproveAllowance(
  signer: ethers.Signer,
  amount: string
): Promise<void> {
  try {
    const signerAddress = await signer.getAddress();
    const mintContract = new ethers.Contract(
      '0x961d79c237601Bf1884908AECB3D2EB2f28B50f2',
      [
        'function allowance(address,address) view returns (uint256)',
        'function approve(address,uint256) returns (bool)'
      ],
      signer
    );

    const value = ethers.parseEther(amount);
    const currentAllowance = await rateLimiter.enqueue(() =>
      mintContract.allowance(signerAddress, LIQUIDITY_PROVIDER)
    );

    if (currentAllowance < value) {
      const tx = await rateLimiter.enqueue(() =>
        mintContract.approve(LIQUIDITY_PROVIDER, value)
      );
      await tx.wait();
    }
  } catch (err) {
    throw new ConversionError('Failed to approve token allowance', err);
  }
}