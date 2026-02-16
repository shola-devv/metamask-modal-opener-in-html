const kafka = require("../kafka");

async function run() {
  const producer = kafka.producer();
  await producer.connect();

  const newsletterPayload = {
    subject: "Weekly Crypto Update",
    body: "Bitcoin is pumping 🚀",
    timestamp: Date.now(),
  };

  await producer.send({
    topic: "newsletter.out",
    messages: [
      { value: JSON.stringify(newsletterPayload) }
    ],
  });

  console.log("Newsletter task published");

  await producer.disconnect();
}

run();