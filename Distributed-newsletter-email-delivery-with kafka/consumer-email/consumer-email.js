const kafka = require("../kafka");
const fs = require("fs");
const nodemailer = require("nodemailer");

async function run() {
  const consumer = kafka.consumer({ groupId: "email-sender-group" });

  await consumer.connect();
  await consumer.subscribe({ topic: "newsletter.out" });

  await consumer.run({
    eachMessage: async ({ message }) => {
      const data = JSON.parse(message.value.toString());
      
      const emails = fs.readFileSync("emails.txt", "utf-8")
        .split("\n")
        .filter(Boolean);

      console.log("Sending newsletter to:", emails.length, "users");

      // configure email transport
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "your_email@gmail.com",
          pass: "your_app_password",
        },
      });

      for (const email of emails) {
        await transporter.sendMail({
          from: "your_email@gmail.com",
          to: email,
          subject: data.subject,
          text: data.body,
        });
      }

      console.log("Emails sent successfully");
    },
  });
}

run();