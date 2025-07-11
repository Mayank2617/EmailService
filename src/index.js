const EmailService = require("./core/EmailService");
const EmailQueue = require("./core/EmailQueue");

const service = new EmailService();
const queue = new EmailQueue(service);

// Simulate adding 15 emails to the queue
const emails = Array.from({ length: 15 }, (_, i) => ({
  messageId: `msg-${i}`,
  to: `user${i}@example.com`,
  subject: "Queue Test",
  body: "This is from the email queue system.",
}));

emails.forEach(email => {
  queue.enqueue(email);
});

setTimeout(() => {
  console.log("\n📊 Final Status Report:");
  console.log(service.statusTracker.getAllStatuses());
}, 8000); // wait 8 sec for queue to finish
