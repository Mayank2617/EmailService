const MockProviderA = require("../providers/MockProviderA");
const MockProviderB = require("../providers/MockProviderB");
const { retryWithBackoff } = require("../utils/helpers");
const IdempotencyStore = require("./IdempotencyStore");
const RateLimiter = require("./RateLimiter");
const StatusTracker = require("./StatusTracker");
const CircuitBreaker = require("./CircuitBreaker");
const Logger = require("../utils/Logger");


class EmailService {
  constructor() {
    this.providerA = new MockProviderA();
    this.providerB = new MockProviderB();
    this.idempotencyStore = new IdempotencyStore();
    this.rateLimiter = new RateLimiter(5); // 5 emails/sec
    this.statusTracker = new StatusTracker();
    this.cbA = new CircuitBreaker(3, 10000); // 3 failures, wait 10 sec
    this.cbB = new CircuitBreaker(3, 10000);
  }
  reset() {
    this.idempotencyStore = new IdempotencyStore();
    this.rateLimiter = new RateLimiter(5); // 5 emails/sec
    this.statusTracker = new StatusTracker();
    this.cbA = new CircuitBreaker(3, 10000);
    this.cbB = new CircuitBreaker(3, 10000);
  }

  async sendEmail(email) {
    const { messageId } = email;

    if (this.idempotencyStore.isAlreadySent(messageId)) {
      this.statusTracker.track(messageId, "SKIPPED");
      return { status: "SKIPPED", messageId };
    }

    await this.rateLimiter.acquire();

    // ✅ Check if Provider A is allowed
    if (this.cbA.canRequest()) {
      try {
        const result = await retryWithBackoff(() => this.providerA.send(email), 3);
        this.cbA.onSuccess();
        this.idempotencyStore.markAsSent(messageId);
        this.statusTracker.track(messageId, "SENT", "ProviderA");
        return { status: "SENT", provider: "ProviderA", messageId };
      } catch (errA) {
        this.cbA.onFailure();
        Logger.warn("Provider A failed. Trying B...");
      }
    } else {
      Logger.warn("⚠️ Provider A is in OPEN state. Skipping it.");
    }

    // ✅ Fallback to Provider B if available
    if (this.cbB.canRequest()) {
      try {
        const result = await retryWithBackoff(() => this.providerB.send(email), 3);
        this.cbB.onSuccess();
        this.idempotencyStore.markAsSent(messageId);
        this.statusTracker.track(messageId, "SENT", "ProviderB");
        return { status: "SENT", provider: "ProviderB", messageId };
      } catch (errB) {
        this.cbB.onFailure();
        this.statusTracker.track(messageId, "FAILED");
        return { status: "FAILED", messageId, error: errB.message };
      }
    } else {
      Logger.warn("⚠️ Provider B is in OPEN state. Cannot send email.");
    }

    this.statusTracker.track(messageId, "FAILED");
    return { status: "FAILED", messageId, error: "Both providers down or blocked." };
  }



}

module.exports = EmailService;
