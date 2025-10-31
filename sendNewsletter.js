import fs from "fs";
import dotenv from "dotenv";
import sgMail from "@sendgrid/mail";

dotenv.config();

// Set SendGrid API key
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Read subscriber emails from JSON file
function getSubscribers() {
  let subscribers = { subscribers: [] };
  if (fs.existsSync("subscribers.json")) {
    const fileData = fs.readFileSync("subscribers.json");
    subscribers = JSON.parse(fileData);
  }
  return subscribers.subscribers;
}

// Send newsletter function
async function sendNewsletter(subject, content) {
  const subscribers = getSubscribers();

  if (subscribers.length === 0) {
    console.log("⚠️ No subscribers found.");
    return;
  }

  const messages = subscribers.map((email) => ({
    to: email,
    from: "lgstechai@gmail.com", // 👈 must be verified in SendGrid
    subject: subject,
    html: `<p>${content}</p>`,
  }));

  try {
    await sgMail.send(messages);
    console.log("✅ Newsletter sent to all subscribers!");
  } catch (error) {
    console.error("❌ Error sending newsletter:", error.response?.body || error);
  }
}

// Example usage (you can edit this before running)
const subject = "🚀 New Product Launch!";
const content = "We just launched our latest product. <a href='https://lgstech.com'>Check it out!</a>";

sendNewsletter(subject, content);
