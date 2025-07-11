class EmailQueue {
  constructor(emailService) {
    this.queue = [];
    this.emailService = emailService;
    this.isProcessing = false;
  }

  enqueue(email) {
    this.queue.push(email);
    this.processQueue(); // Start processing if not already
  }

  async processQueue() {
    if (this.isProcessing) return; // Already processing
    this.isProcessing = true;

    while (this.queue.length > 0) {
      const email = this.queue.shift();
      try {
        const result = await this.emailService.sendEmail(email);
        console.log(`✅ Processed: ${email.messageId} -> ${result.status}`);
      } catch (err) {
        console.error(`❌ Failed to process ${email.messageId}: ${err.message}`);
      }
    }

    this.isProcessing = false;
  }
}

module.exports = EmailQueue;
