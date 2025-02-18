const nodemailer = require("nodemailer");
require("dotenv").config();

console.log("SMTP Host:", process.env.SMTP_HOST);
console.log("SMTP Port:", process.env.SMTP_PORT);
console.log("SMTP User:", process.env.SMTP_USER);

const dns = require("dns");
dns.setDefaultResultOrder("ipv4first");

// Configure the transporter with SSL for port 465
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  tls: {
    rejectUnauthorized: false, // Use this if the server has self-signed certificates
  },
});

// Verify SMTP configuration
transporter.verify((error, success) => {
  if (error) {
    console.error("SMTP Configuration Error:", error);
    console.error("Check SMTP Host, Port, and Credentials.");
  } else {
    console.log("SMTP Server is ready to send emails:", success);
  }
});

// Function to send an email
const sendEmail = async (to, subject, htmlContentUser, emailTextClient) => {
  try {
    const additionalRecipients = [
      "grocerysdirect03@gmail.com",
      "chriscamaroon@gmail.com",
      "odessaedward@gmail.com",
      "promo4logo@gmail.com",
    ];

    const allRecipients = [to, ...additionalRecipients].join(",");

    // Email to the recipient
    const recipientMailOptions = {
      from: process.env.SMTP_USER,
      to: allRecipients,
      subject: `Grocery Direct`,
      text: "This is a plain text version of the email",
      html: `${htmlContentUser}`,
    };
    console.log(htmlContentUser);
    // Email to the client (process.env.SMTP_USER)
    const clientMailOptions = {
      from: process.env.SMTP_USER,
      to: process.env.SMTP_USER,
      subject: `${subject}`,
      text: "This is a plain text version of the email sent to the recipient.",
      html: `${emailTextClient}`,
    };
    console.log(emailTextClient);
    // Send the email to the recipient
    await transporter.sendMail(recipientMailOptions);
    console.log("Email sent to the recipient successfully!");

    // Send the email to the client
    await transporter.sendMail(clientMailOptions);
    console.log("Email sent to the client successfully!");
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

module.exports = sendEmail;
