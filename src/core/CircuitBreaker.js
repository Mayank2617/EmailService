class CircuitBreaker {
  constructor(failureThreshold = 3, resetTimeout = 10000) {
    this.failureThreshold = failureThreshold;
    this.resetTimeout = resetTimeout;

    this.failureCount = 0;
    this.lastFailureTime = null;
    this.state = "CLOSED"; // CLOSED | OPEN | HALF-OPEN
  }

  canRequest() {
    const now = Date.now();

    if (this.state === "OPEN") {
      if (now - this.lastFailureTime >= this.resetTimeout) {
        this.state = "HALF-OPEN"; // Try again
        return true;
      }
      return false; // Still blocked
    }

    return true; // CLOSED or HALF-OPEN
  }

  onSuccess() {
    this.failureCount = 0;
    this.state = "CLOSED";
  }

  onFailure() {
    this.failureCount += 1;
    if (this.failureCount >= this.failureThreshold) {
      this.state = "OPEN";
      this.lastFailureTime = Date.now();
      console.warn(`🔌 Circuit opened due to repeated failures.`);
    }
  }
}

module.exports = CircuitBreaker;
