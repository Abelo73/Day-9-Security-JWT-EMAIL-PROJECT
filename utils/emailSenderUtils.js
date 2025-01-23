const nodemailer = require("nodemailer");
require("dotenv").config();

const sendEmail = async ({ to, subject, text, html }) => {
  try {
    // Create transporter using SMTP configuration from environment
    let transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || "smtp.gmail.com",
      port: process.env.EMAIL_PORT || 587, // Default Gmail SMTP port
      secure: false, // Use STARTTLS
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Fallback for missing HTML/Text
    if (!html && text) html = `<p>${text}</p>`;
    if (!text && html) text = html.replace(/<\/?[^>]+(>|$)/g, ""); // Strip HTML tags

    // Set email options
    let mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      text,
      html,
    };

    // Send email
    let info = await transporter.sendMail(mailOptions);
    console.log("Message sent: %s", info.response);
  } catch (error) {
    console.error("Error sending email:", error.message || error);
    throw new Error(
      "Failed to send email. Please check your email configuration."
    );
  }
};

module.exports = { sendEmail };
