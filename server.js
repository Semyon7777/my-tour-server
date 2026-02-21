const express = require("express");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const cors = require("cors");
// const path = require("path"); // Больше не нужен для API

const app = express();

// 1. Настройка CORS
// Это позволит твоему сайту на Netlify делать запросы к этому серверу
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

// 2. УДАЛЯЕМ или КОММЕНТИРУЕМ раздачу статики
// На Render нам не нужен билд React, так как он живет на Netlify
/*
app.use(express.static(path.join(__dirname, "client", "build")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "build", "index.html"));
});
*/

// Простой проверочный маршрут, чтобы знать, что сервер жив
app.get("/", (req, res) => {
  res.send("Server is running!");
});

// Маршрут бронирования тура
app.post("/send-email", (req, res) => {
  const { tourName, firstName, lastName, year, from, birthday, startDate, days, state, city, pincode, course, email } = req.body;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // Использование SSL
    auth: {
      user: "parmanitour@gmail.com",
      pass: "apllkepmhgkkiemo" // Твой 16-значный App Password (без пробелов)
    },
    connectionTimeout: 10000, // 10 секунд на попытку
  });

  const mailOptions = {
    from: "parmanitour@gmail.com",
    to: "parmanitour@gmail.com",
    subject: `New Booking: ${tourName}`,
    text: `
      Tour Name: ${tourName}
      First Name: ${firstName}
      Last Name: ${lastName}
      Email: ${email}
      From: ${from}
      Birthday: ${birthday}
      Start Date: ${startDate}
      Days: ${days}
      City/State: ${city}, ${state}
    `
  };
  
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      return res.status(500).send("Error: " + error.toString());
    }
    res.status(200).send("Email sent: " + info.response);
  });
});

// Маршрут контактов
app.post("/contact", (req, res) => {
  const { name, email, message } = req.body;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // Использование SSL
    auth: {
      user: "parmanitour@gmail.com",
      pass: "apllkepmhgkkiemo" // Твой 16-значный App Password (без пробелов)
    },
    connectionTimeout: 10000, // 10 секунд на попытку
  });

  const mailOptions = {
    from: "parmanitour@gmail.com", 
    to: "parmanitour@gmail.com",
    subject: "New Contact Message",
    text: `
      Name: ${name}
      Email: ${email}
      Message: ${message}
    `
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      return res.status(500).send("Error: " + error.toString());
    }
    res.status(200).send("Contact message sent: " + info.response);
  });
});

// 3. ПРАВИЛЬНЫЙ ПОРТ ДЛЯ RENDER
// Render сам передает порт через переменную окружения PORT
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});