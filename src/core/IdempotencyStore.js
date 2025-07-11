class IdempotencyStore {
  constructor() {
    this.sentMessageIds = new Set(); // Memory-based storage
  }

  isAlreadySent(messageId) {
    return this.sentMessageIds.has(messageId);
  }

  markAsSent(messageId) {
    this.sentMessageIds.add(messageId);
  }
}

module.exports = IdempotencyStore;
