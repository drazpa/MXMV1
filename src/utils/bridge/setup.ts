import { ethers } from 'ethers';
import { BRIDGE_ADDRESS, BRIDGE_ABI } from './constants';

export async function setupBridgeToken(provider: ethers.Provider) {
  try {
    const signer = await provider.getSigner();
    const bridge = new ethers.Contract(BRIDGE_ADDRESS, BRIDGE_ABI, signer);

    // MINT token address
    const MINT_TOKEN = '0x961d79c237601Bf1884908AECB3D2EB2f28B50f2';
    
    // Check if already supported
    const isSupported = await bridge.supportedTokens(MINT_TOKEN);
    if (isSupported) {
      console.log('MINT token already supported');
      return;
    }

    // Add MINT token with minimum amount of 0.1 tokens
    const minAmount = ethers.parseUnits('0.1', 18);
    const tx = await bridge.addToken(MINT_TOKEN, minAmount);
    await tx.wait();
    
    console.log('MINT token added to bridge');
  } catch (err) {
    console.error('Failed to setup bridge token:', err);
    throw err;
  }
}