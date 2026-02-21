const express = require("express");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const cors = require("cors");
const dns = require("dns");

// ПРИНУДИТЕЛЬНО используем IPv4 (решает проблему Connection Timeout)
dns.setDefaultResultOrder('ipv4first');

const app = express()

app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

// Проверочный маршрут
app.get("/", (req, res) => {
  res.send("Parmani Tour API is running!");
});

// Настройка почты (ОДИН раз для всего сервера)
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // false для порта 587
  auth: {
    user: "parmanitour@gmail.com",
    pass: "apllkepmhgkkiemo"
  },
  tls: {
    rejectUnauthorized: false // Обход ограничений сети
  },
  connectionTimeout: 30000, // Даем серверу 30 секунд на попытку
  greetingTimeout: 30000,
  socketTimeout: 30000
});

// Маршрут бронирования
app.post("/send-email", (req, res) => {
  const { tourName, firstName, lastName, email, from, birthday, startDate, days, city, state } = req.body;

  const mailOptions = {
    from: "parmanitour@gmail.com",
    to: "parmanitour@gmail.com",
    subject: `New Booking: ${tourName}`,
    text: `Tour: ${tourName}\nName: ${firstName} ${lastName}\nEmail: ${email}\nFrom: ${from}\nStart: ${startDate}`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Nodemailer Error:", error);
      return res.status(500).send("Error: " + error.message);
    }
    res.status(200).send("Email sent: " + info.response);
  });
});

// Маршрут контактов
app.post("/contact", (req, res) => {
  const { name, email, message } = req.body;

  const mailOptions = {
    from: "parmanitour@gmail.com",
    to: "parmanitour@gmail.com",
    subject: "New Contact Message",
    text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Nodemailer Error:", error);
      return res.status(500).send("Error: " + error.message);
    }
    res.status(200).send("Message sent: " + info.response);
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});