const EmailService = require("../core/EmailService");

// 👇 Create a subclass to control behavior in tests
class TestEmailService extends EmailService {
  constructor() {
    super();

    // Override providers for predictable behavior
    this.providerA.send = jest.fn();
    this.providerB.send = jest.fn();
  }
}

describe("EmailService", () => {
  let service;

  beforeEach(() => {
    service = new TestEmailService();
  });

  test("should send email via Provider A on first try", async () => {
    service.providerA.send.mockResolvedValue("sent-by-A");

    const email = { messageId: "test-1", to: "user@test.com", body: "Hello" };
    const res = await service.sendEmail(email);

    expect(res.status).toBe("SENT");
    expect(res.provider).toBe("ProviderA");
    expect(service.providerA.send).toHaveBeenCalledTimes(1);
  });

  test("should retry and then fallback to Provider B on failure", async () => {
    service.providerA.send.mockRejectedValue(new Error("A failed"));
    service.providerB.send.mockResolvedValue("sent-by-B");

    const email = { messageId: "test-2", to: "user@test.com", body: "Hello" };
    const res = await service.sendEmail(email);

    expect(res.status).toBe("SENT");
    expect(res.provider).toBe("ProviderB");
    expect(service.providerA.send).toHaveBeenCalled();
    expect(service.providerB.send).toHaveBeenCalled();
  });

  test("should skip email if already sent (idempotency)", async () => {
    service.providerA.send.mockResolvedValue("sent-by-A");

    const email = { messageId: "test-3", to: "user@test.com", body: "Hello" };
    await service.sendEmail(email); // First send
    const res = await service.sendEmail(email); // Duplicate send

    expect(res.status).toBe("SKIPPED");
  });

  test("should fail when both providers fail", async () => {
  service.providerA.send.mockRejectedValue(new Error("A failed"));
  service.providerB.send.mockRejectedValue(new Error("B failed"));

  const email = { messageId: "test-4", to: "user@test.com", body: "Hello" };
  const res = await service.sendEmail(email);

  expect(res.status).toBe("FAILED");
  expect(res.error).toBeDefined();
}, 10000); // ✅ Set 10 second timeout

});
