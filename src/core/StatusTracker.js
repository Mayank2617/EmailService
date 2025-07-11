class StatusTracker {
  constructor() {
    this.statuses = new Map(); // Map of messageId -> status info
  }

  track(messageId, status, provider = null) {
    this.statuses.set(messageId, {
      status,
      provider,
      timestamp: new Date().toISOString(),
    });
  }

  getStatus(messageId) {
    return this.statuses.get(messageId);
  }

  getAllStatuses() {
    return Array.from(this.statuses.entries()).map(([id, info]) => ({
      messageId: id,
      ...info,
    }));
  }
}

module.exports = StatusTracker;
