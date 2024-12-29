import { ethers } from 'ethers';
import { MINT_TOKEN_ADDRESS, LIQUIDITY_PROVIDER } from './constants';
import { validateConversion } from './validation';
import { checkLiquidity } from './liquidity';
import { ConversionError } from './errors';

export async function convertMXMtoMINT(signer: ethers.Signer, amount: string) {
  const provider = signer.provider as ethers.Provider;
  if (!provider) throw new ConversionError('Provider not connected');
  
  await validateConversion(provider, 'MXM', amount);
  const hasLiquidity = await checkLiquidity(provider, 'MXM', amount);
  if (!hasLiquidity) {
    throw new ConversionError('Insufficient liquidity for conversion');
  }

  try {
    const value = ethers.parseEther(amount);
    const tx = await signer.sendTransaction({
      to: LIQUIDITY_PROVIDER,
      value
    });
    await tx.wait();
  } catch (err) {
    throw new ConversionError('MXM to MINT conversion failed', err);
  }
}

export async function convertMINTtoMXM(signer: ethers.Signer, amount: string) {
  const provider = signer.provider as ethers.Provider;
  if (!provider) throw new ConversionError('Provider not connected');
  
  await validateConversion(provider, 'MINT', amount);
  const hasLiquidity = await checkLiquidity(provider, 'MINT', amount);
  if (!hasLiquidity) {
    throw new ConversionError('Insufficient liquidity for conversion');
  }

  try {
    const mintContract = new ethers.Contract(
      MINT_TOKEN_ADDRESS,
      ['function transfer(address,uint256) returns (bool)'],
      signer
    );

    const value = ethers.parseEther(amount);
    const tx = await mintContract.transfer(LIQUIDITY_PROVIDER, value);
    await tx.wait();
  } catch (err) {
    throw new ConversionError('MINT to MXM conversion failed', err);
  }
}