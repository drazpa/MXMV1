import { ethers } from 'ethers';

interface RpcConfig {
  url: string;
  headers: Record<string, string>;
}

export function sanitizeRpcUrl(url: string): RpcConfig {
  try {
    const urlObj = new URL(url);
    // If URL contains credentials, move them to headers
    if (urlObj.username || urlObj.password) {
      const credentials = Buffer.from(`${urlObj.username}:${urlObj.password}`).toString('base64');
      // Remove credentials from URL
      urlObj.username = '';
      urlObj.password = '';
      return {
        url: urlObj.toString(),
        headers: {
          'Authorization': `Basic ${credentials}`
        }
      };
    }
    return { url: url, headers: {} };
  } catch (err) {
    throw new Error('Invalid RPC URL');
  }
}