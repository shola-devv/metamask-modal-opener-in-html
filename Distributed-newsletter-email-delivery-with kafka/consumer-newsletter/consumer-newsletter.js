const kafka = require("../kafka");
const fs = require("fs");
const nodemailer = require("nodemailer");

async function run() {
  const consumer = kafka.consumer({ groupId: "simulation-group" });

  await consumer.connect();
  await consumer.subscribe({ topic: "newsletter.out" });

  await consumer.run({
    eachMessage: async ({ message }) => {
      const data = JSON.parse(message.value.toString());

      console.log("Simulating newsletter notification send...");

      // Read emails from txt file
      const emails = fs.readFileSync("emails.txt", "utf-8")
        .split("\n")
        .filter(Boolean);

      // Create email transporter
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "your_email@gmail.com",
          pass: "your_app_password", // Use Gmail App Password
        },
      });

      for (const email of emails) {
        await transporter.sendMail({
          from: "your_email@gmail.com",
          to: email,
          subject: "A quick Hello ",
          text: `Hi there,

I'm Emmanuel. I just wanted to make sure you're having a great day 😊.
 I also just sent in my weekly crypto update, would be awesome if you checked it out.

Stay positive and keep building!

Cheers,
Emmanuel`,
        });

        console.log(`Simulation email sent to: ${email}`);
      }

      console.log("Simulation completed.");
    },
  });
}

run();