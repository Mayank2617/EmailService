const StatusTracker = require("../core/StatusTracker");

describe("StatusTracker", () => {
  let tracker;

  beforeEach(() => {
    tracker = new StatusTracker();
  });

  test("should record and retrieve status", () => {
    tracker.track("msg-1", "SENT", "A");

    const result = tracker.getStatus("msg-1");
    expect(result.status).toBe("SENT");
    expect(result.provider).toBe("A");
    expect(result).toHaveProperty("timestamp");
  });

  test("should retrieve all statuses", () => {
    tracker.track("msg-1", "SENT");
    tracker.track("msg-2", "FAILED");

    const all = tracker.getAllStatuses();

    expect(all).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ messageId: "msg-1", status: "SENT" }),
        expect.objectContaining({ messageId: "msg-2", status: "FAILED" }),
      ])
    );
  });
});
