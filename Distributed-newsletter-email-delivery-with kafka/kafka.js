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