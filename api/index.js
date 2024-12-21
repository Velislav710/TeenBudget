const express = require("express");
const mysql = require("mysql2");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const crypto = require("crypto");
const db = require("./database");

const app = express();
app.use(cors());
app.use(express.json());

const SECRET_KEY = "1a2b3c4d5e6f7g8h9i0jklmnopqrstuvwxyz123456";
const EMAIL_USER = "no-reply@teenbudget.noit.eu";
const EMAIL_PASS = "Noit_2025";

const transporter = nodemailer.createTransport({
  host: "teenbudget.noit.eu",
  port: 587,
  secure: false,
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS
  }
});

app.post("/password-reset-request", (req, res) => {
  const { email } = req.body;

  db.findUserByEmail(email, (err, results) => {
    if (err) return res.status(400).json({ error: err.message });
    if (results.length === 0) {
      return res.status(400).json({ error: "Не съществува потребител с този имейл адрес!" });
    }

    const user = results[0];
    const token = jwt.sign({ id: user.id }, SECRET_KEY, { expiresIn: "15m" });

    const mailOptions = {
      from: EMAIL_USER,
      to: email,
      subject: "Промяна на паролата за ТийнБюджет",
      html: `
      <div style="text-align: center; background-color: rgba(244, 211, 139, 0.5); margin: 2% 3%; padding: 3% 1%; border: 4px dotted rgb(178, 50, 0); border-radius: 20px">
        <h2>Заявка за промяна на парола в <span style="color: rgb(178, 50, 0); font-weight: 600;">🕮</span>ТийнБюджет<span style="color: rgb(178, 50, 0); font-weight: 600;">🕮</span></h2>
        <hr style="border: 0.5px solid rgb(178, 50, 0); width: 18%; margin-top: 6%; margin-bottom: 4%"></hr>
        <p>Натиснете  <a href="http://localhost:5174/resetbasic/${token}"
 за промяна на паролата.</p>
 
      </div>
      <div>
        <p style="border-radius: 5px; background-color: rgba(178, 50, 0, 0.2); text-align: center; font-size: 13px; margin: 5% 25% 0% 25%">Не сте поискали промяна? Игнорирайте този имейл.</p>
      </div>`
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) return res.status(500).json({ error: "Не успяхме да изпратим имейл!" });
      res.json({ message: "Линкът за промяна на паролата е изпратен на вашия имейл!" });
    });
  });
});

app.listen(5000, () => {
  console.log("Server started on http://localhost:5000");
});




