const { sleep } = require("../utils/helpers");

class RateLimiter {
  constructor(limitPerSecond = 5) {
    this.limit = limitPerSecond;
    this.timestamps = []; // when emails were sent
  }

  async acquire() {
    const now = Date.now();
    this.timestamps = this.timestamps.filter(ts => now - ts < 1000); // keep only last 1 sec timestamps

    if (this.timestamps.length >= this.limit) {
      const waitTime = 1000 - (now - this.timestamps[0]);
      console.log(`🚦 Rate limit hit. Waiting for ${waitTime}ms...`);
      await sleep(waitTime);
      return this.acquire(); // try again after wait
    }

    this.timestamps.push(now); // allow current request
  }
}

module.exports = RateLimiter;
