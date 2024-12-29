import { ethers } from 'ethers';

interface QueuedRequest {
  execute: () => Promise<any>;
  resolve: (value: any) => void;
  reject: (error: any) => void;
}

class RequestThrottler {
  private queue: QueuedRequest[] = [];
  private processing = false;
  private requestsPerSecond: number;
  private lastRequestTime: number = 0;

  constructor(requestsPerSecond = 5) {
    this.requestsPerSecond = requestsPerSecond;
  }

  async enqueue<T>(execute: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.queue.push({ execute, resolve, reject });
      this.processQueue();
    });
  }

  private async processQueue() {
    if (this.processing || this.queue.length === 0) return;
    this.processing = true;

    while (this.queue.length > 0) {
      const timeSinceLastRequest = Date.now() - this.lastRequestTime;
      const minDelay = (1000 / this.requestsPerSecond);
      
      if (timeSinceLastRequest < minDelay) {
        await new Promise(resolve => setTimeout(resolve, minDelay - timeSinceLastRequest));
      }

      const request = this.queue.shift();
      if (!request) continue;

      try {
        const result = await request.execute();
        request.resolve(result);
      } catch (error) {
        request.reject(error);
      }

      this.lastRequestTime = Date.now();
    }

    this.processing = false;
  }
}

export const requestThrottler = new RequestThrottler();