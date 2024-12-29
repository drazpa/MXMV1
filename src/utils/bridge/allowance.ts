import { ethers } from 'ethers';
import { BRIDGE_ADDRESS, ERC20_ABI } from './constants';

export async function checkAllowance(
  provider: ethers.Provider,
  tokenAddress: string,
  ownerAddress: string,
  amount: string
): Promise<boolean> {
  if (tokenAddress === ethers.ZeroAddress) return true;
  
  try {
    const token = new ethers.Contract(tokenAddress, ERC20_ABI, provider);
    
    // Get token decimals
    const decimals = await token.decimals();
    
    const allowance = await token.allowance(ownerAddress, BRIDGE_ADDRESS);
    const requiredAmount = ethers.parseUnits(amount, decimals);
    
    return allowance >= requiredAmount;
  } catch (err) {
    console.error('Failed to check allowance:', err);
    return false;
  }
}

export async function approveToken(
  signer: ethers.Signer,
  tokenAddress: string,
  amount: string
): Promise<void> {
  const token = new ethers.Contract(tokenAddress, ERC20_ABI, signer);
  const decimals = await token.decimals();
  const requiredAmount = ethers.parseUnits(amount, decimals);
  
  const tx = await token.approve(BRIDGE_ADDRESS, requiredAmount);
  await tx.wait();
}