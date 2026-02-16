# Distributed Newsletter Email Delivery with Kafka

## Overview

This project demonstrates an event-driven distributed system built with Node.js and cloud-hosted Kafka.

**Technologies Used:**
- Apache Kafka for event streaming
- Confluent Cloud as the managed Kafka provider
- Node.js for producer and consumer services
- Nodemailer for email delivery




The system publishes a `newsletter.out` event, which is consumed by multiple independent services:

- 📢 **Newsletter Notification Service** – Sends notification emails
- 📰 **Newsletter Delivery Service** – Sends the full newsletter content

Each service operates in its own Kafka consumer group, allowing them to process the same event independently.

### Architecture

```
Producer (Newsletter Publisher)
        ↓
Kafka Topic: newsletter.out
        ↓
────────────────────────────────────────
│ Consumer Group A → Notification Mail │
│ Consumer Group B → Newsletter Mail   │
────────────────────────────────────────
```

### Key Design Principles

- The producer does not know who consumes the event
- Consumers are decoupled and independently scalable
- Each consumer group receives the full event stream
- This is a classic event-driven microservice architecture

## Getting Started

### Installation

```bash
git clone <repo-url>
cd Distributed-newsletter-email-delivery-with-kafka
npm init -y
```

### Configuration

#### Kafka Cloud Setup

1. Create your Kafka cluster in Confluent Cloud
2. Update `kafka.js` with:
   - Bootstrap server
   - API key
   - API secret

**Example `kafka.js`:**

```javascript
const { Kafka } = require("kafkajs");

const kafka = new Kafka({
  clientId: "newsletter-service",
  brokers: ["YOUR_BOOTSTRAP_SERVER"],
  ssl: true,
  sasl: {
    mechanism: "plain",
    username: "API_KEY",
    password: "API_SECRET",
  },
});

module.exports = kafka;
```

#### Email Configuration

1. Create a `.env` file:

```
# Gmail credentials for sending emails
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password


# Kafka Cloud credentials
KAFKA_CLIENT_ID=newsletter-service
KAFKA_BROKER=your_bootstrap_server_here
KAFKA_USERNAME=your_api_key
KAFKA_PASSWORD=your_api_secret
```

⚠️ **Security Note:** Use Gmail App Passwords (do not hardcode credentials).

## Running the System

### Start Consumer Services

Open separate terminals and run:

```bash
node consumer-email/consumer-email.js
node consumer-newsletter/consumer-newsletter.js
```

### Publish a Newsletter Event

```bash
node producer/producer.js
```

Once published:
- Notification emails are sent
- Full newsletter emails are delivered

## How It Works

### Producer

- Publishes a JSON payload to the `newsletter.out` topic

**Example payload:**

```json
{
  "subject": "Weekly Crypto Update",
  "body": "Bitcoin is pumping 🚀",
  "timestamp": 1700000000
}
```

### Consumer Group A – Notification Service

- Listens to `newsletter.out` topic
- Sends notification emails
- Uses `emails.txt` as recipient list

### Consumer Group B – Newsletter Service

- Listens to `newsletter.out` topic
- Sends full newsletter content
- Runs independently from notification service

## Author

Emmanuel Fayinminu