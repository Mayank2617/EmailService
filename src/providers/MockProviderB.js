const Logger = require("../utils/Logger.js");

class MockProviderB {
  constructor() {
    this.name = "MockProviderB";
  }

  async send(email) {
    Logger.info(`[${this.name}] Attempting to send email to ${email.to}`);

    // Simulate success or failure randomly
    const success = Math.random() > 0.1; // 50% success rate

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (success) {
          Logger.info(`[${this.name}] Email sent successfully!`);
          resolve({ provider: this.name, status: "SENT" });
        } else {
          Logger.info(`[${this.name}] Email sending failed!`);
          reject(new Error("Failed to send from MockProviderB"));
        }
      }, 500);
    });
  }
}

module.exports = MockProviderB;
