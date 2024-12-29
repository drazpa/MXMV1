// Rate limiting utility for RPC calls
export class RateLimiter {
  private queue: Array<() => Promise<any>> = [];
  private processing = false;
  private lastCall = 0;
  private minDelay = 1000; // 1 second between calls

  async enqueue<T>(fn: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.queue.push(async () => {
        try {
          const result = await fn();
          resolve(result);
        } catch (err) {
          reject(err);
        }
      });
      this.processQueue();
    });
  }

  private async processQueue() {
    if (this.processing || this.queue.length === 0) return;
    this.processing = true;

    while (this.queue.length > 0) {
      const now = Date.now();
      const timeToWait = Math.max(0, this.lastCall + this.minDelay - now);
      if (timeToWait > 0) {
        await new Promise(resolve => setTimeout(resolve, timeToWait));
      }

      const fn = this.queue.shift();
      if (fn) {
        try {
          await fn();
        } catch (error) {
          console.error('Queue processing error:', error);
        }
        this.lastCall = Date.now();
      }
    }

    this.processing = false;
  }
}

export const rateLimiter = new RateLimiter();