const Logger = require("../utils/Logger.js");

class MockProviderA {
  constructor() {
    this.name = "MockProviderA";
  }

  async send(email) {
    Logger.info(`[${this.name}] Attempting to send email to ${email.to}`);

    // Simulate success or failure randomly
    const success = Math.random() > 0.95; // 70% success rate

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (success) {
          Logger.info(`[${this.name}] Email sent successfully!`);
          resolve({ provider: this.name, status: "SENT" });
        } else {
          Logger.info(`[${this.name}] Email sending failed!`);
          reject(new Error("Failed to send from MockProviderA"));
        }
      }, 500); // simulate delay
    });
  }
  // For Test Purpose
  // async send(email) {
  // return Promise.reject(new Error("Forced failure for retry/fallback test"));
  // For test 
  // }

}

module.exports = MockProviderA;
