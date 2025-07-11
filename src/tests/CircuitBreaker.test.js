const CircuitBreaker = require("../core/CircuitBreaker");

describe("CircuitBreaker", () => {
  let breaker;

  beforeEach(() => {
    breaker = new CircuitBreaker(2, 1000); // 2 failures, 1 sec reset
  });

  test("should be closed initially", () => {
    expect(breaker.canRequest()).toBe(true);
  });

  test("should open circuit after failures", () => {
    breaker.onFailure();
    breaker.onFailure();
    expect(breaker.canRequest()).toBe(false);
  });

  test("should close circuit after timeout", (done) => {
    breaker.onFailure();
    breaker.onFailure();

    setTimeout(() => {
      expect(breaker.canRequest()).toBe(true);
      done();
    }, 1100);
  });

  test("should reset failure count after success", () => {
    breaker.onFailure();
    breaker.onSuccess();
    expect(breaker.canRequest()).toBe(true);
  });
});
