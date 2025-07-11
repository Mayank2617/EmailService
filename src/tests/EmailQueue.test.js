const EmailQueue = require("../core/EmailQueue");

describe("EmailQueue", () => {
  test("should process emails in order", async () => {
    const calls = [];

    const fakeService = {
      sendEmail: async (email) => {
        calls.push(email.messageId);
        return { status: "SENT" };
      },
    };

    const queue = new EmailQueue(fakeService);

    queue.enqueue({ messageId: "msg-1" });
    queue.enqueue({ messageId: "msg-2" });

    // Wait a bit for async processing
    await new Promise((resolve) => setTimeout(resolve, 500));

    expect(calls).toEqual(["msg-1", "msg-2"]);
  });
});
