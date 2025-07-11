const RateLimiter = require("../core/RateLimiter");

describe("RateLimiter", () => {
  test("should allow N operations per interval", async () => {
    const limiter = new RateLimiter(2, 1000); // 2 ops/sec

    const start = Date.now();

    await limiter.acquire();
    await limiter.acquire();
    await limiter.acquire(); // Should cause 1 sec delay

    const timeTaken = Date.now() - start;

    expect(timeTaken).toBeGreaterThanOrEqual(1000);
  });
});
