const express = require("express");
const EmailService = require("./src/core/EmailService");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

const emailService = new EmailService();

// POST /send-email
app.post("/send-email", async (req, res) => {
  const { messageId, to, subject, body } = req.body;

  if (!messageId || !to || !subject || !body) {
    return res.status(400).json({ error: "messageId, to, subject, and body are required." });
  }

  try {
    const result = await emailService.sendEmail({ messageId, to, subject, body });
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: "Unexpected error", details: error.message });
  }
});

app.get("/statuses", (req, res) => {
  const statuses = emailService.statusTracker.getAllStatuses();
  res.json(statuses);
});

// GET /statuses/:id - Get status of a specific messageId
app.get("/statuses/:id", (req, res) => {
  const messageId = req.params.id;
  const status = emailService.statusTracker.getStatus(messageId);

  if (status) {
    res.json({ messageId, ...status });
  } else {
    res.status(404).json({ error: "Status not found for this messageId." });
  }
});


// Health check route
app.get("/", (req, res) => {
  res.send("✅ Email Service is running!");
});

// POST /reset - Reset all internal states
app.post("/reset", (req, res) => {
  emailService.reset();
  res.json({ message: "Service state has been reset." });
});

// GET /health - Service health check
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});


app.listen(PORT, () => {
  console.log(`🚀 Server is running at http://localhost:${PORT}`);
});
