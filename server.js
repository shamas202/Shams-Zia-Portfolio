const express = require("express");
const path = require("path");
const nodemailer = require("nodemailer");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.static(path.join(__dirname, "dist")));
app.use("/videos", express.static(path.join(__dirname, "public/videos")));

// Contact form API endpoint
app.post("/api/contact", async (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: "All fields required" });
  }
  // Configure your SMTP here
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAIL_USER || "shamsiop7000@gmail.com",
      pass: process.env.MAIL_PASS || "your_app_password",
    },
  });
  try {
    await transporter.sendMail({
      from: email,
      to: "shamsiop7000@gmail.com",
      subject: `Portfolio Contact from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
    });
    res.json({ success: true, message: "Message transmitted!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to send. Check SMTP config." });
  }
});

// All other routes → React app
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

app.listen(PORT, () => console.log(`🟢 Server running on http://localhost:${PORT}`));
