# Resilient Email Sending Service

A robust and modular email sending service built with JavaScript. This system is designed to ensure reliable email delivery using multiple mock providers, complete with retry logic, provider fallback, rate limiting, idempotency, and status tracking.

## 🌐 Deployment

The project is deployed using **Render**.

> 🔗 [Live API Endpoint (Render)](https://emailservice-sxcl.onrender.com)

---

## ✨ Features

- ✅ **Retry Mechanism** with exponential backoff  
- 🔁 **Provider Fallback** (switches between Provider A & B on failure)  
- 🚦 **Rate Limiting** (limits emails/sec)  
- ♻️ **Idempotency** (prevents duplicate sends)  
- 📊 **Status Tracking** (records each email attempt's status)  
- 🛑 **Circuit Breaker** (bonus - avoids repeated failure loops)  
- 📦 **Queue System** (bonus - basic message queuing)  
- 📜 **Logging** (simple and clean console logging)

---

## 🛠 Tech Stack

- **Node.js**
- **JavaScript (ES6+)**
- Tested with **Jest**

---

## 💻 Local Setup

1. **Clone the repository**

```bash
git clone https://github.com/your-username/EmailService.git
cd EmailService
```

2. **Install dependencies**

```bash
npm install
```

3. **Start the server**

```bash
node src/index.js
```

4. **Test with Postman**  
Use `http://localhost:3000` as your base URL and test the endpoints listed above.

---

## 🧪 Running Tests

```bash
npm install
npm test
```

All core components are tested using Jest with coverage for:
- Email delivery flow
- Retry + fallback
- Rate limiting
- Circuit breaker behavior
- Idempotency tracking

---


## 🚀 API Endpoints

### `POST /send`  
Sends a new email via one of the providers.

#### Request Body
```json
{
  "messageId": "msg-001",
  "to": "example@example.com",
  "subject": "Hello from the email service!",
  "body": "This is a test email."
}
```

#### Response
```json
{
  "status": "SENT",
  "provider": "ProviderA",
  "messageId": "msg-001"
}
```

---

### `GET /statuses`  
Returns the status of all attempted email sends.

#### Response
```json
[
  {
    "messageId": "msg-001",
    "status": "SENT",
    "provider": "ProviderA",
    "timestamp": "2025-07-11T07:00:00.000Z"
  }
]
```

---

### `GET /statuses/:id`  
Get status of a specific message by `messageId`.

---

### `POST /reset`  
Resets all internal data: statuses, idempotency store, circuit breakers, etc. Useful for testing.

---

### `GET /health`  
Simple health check endpoint.

---

## 📁 Project Structure

```
src/
├── core/               # Business logic (EmailService, RateLimiter, etc.)
├── providers/          # Mock email providers
├── utils/              # Logger and helper functions
├── tests/              # Unit tests
└── index.js            # Express app entry point
```

---






## 📌 Assumptions

- Email sending is mocked; no actual emails are sent.
- Retry logic is exponential: 1s, 2s, 4s between retries.
- Both mock providers randomly succeed/fail to simulate real-world conditions.
- Idempotency is message-based: duplicate `messageId` won't resend.
- The rate limiter is fixed at 5 emails per second.
- Circuit breaker opens after 3 consecutive failures, stays open for 10s.

---

## ✅ To-Do / Future Improvements

- Add persistent store (Redis/DB) for idempotency and statuses  
- Add real email provider integrations (e.g., SendGrid, Mailgun)  
- Add metrics/dashboard (monitor retries, failure rates)  
- Improve queue system for larger-scale email batching  

---

## 🤝 Author

**Mayank Sahu**  
🚀 Passionate about backend engineering, reliability, and clean architecture.


