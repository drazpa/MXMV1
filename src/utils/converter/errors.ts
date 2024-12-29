import { ethers } from 'ethers';

export class ConversionError extends Error {
  constructor(message: string, public cause?: unknown) {
    super(message);
    this.name = 'ConversionError';
    Object.setPrototypeOf(this, ConversionError.prototype);
  }
}

export function handleError(error: unknown): ConversionError {
  if (error instanceof ConversionError) {
    return error;
  }

  if (error instanceof Error) {
    if (error.message.includes('insufficient funds')) {
      return new ConversionError('Insufficient balance for transaction');
    }
    if (error.message.includes('user rejected')) {
      return new ConversionError('Transaction was rejected');
    }
    return new ConversionError(error.message, error);
  }

  return new ConversionError('Conversion failed - please try again');
}