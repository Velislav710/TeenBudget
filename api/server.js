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
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
require("dotenv").config();

const whitelist = [
  "http://localhost:5173",
  "http://localhost:5174",
  "https://teenbudget.noit.eu"
];
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || whitelist.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  optionSuccessStatus: 204
};

app.use(cors(corsOptions));

let verificationCodes = {};

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
  },
  debug: true
});

app.post("/signup", (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  db.checkEmailExists(email, (err, results) => {
    if (err) return res.status(500).json({ error: "Database query error" });

    if (results.length > 0) {
      return res
        .status(400)
        .json({ error: "Профил с този имейл вече съществува." });
    }

    const verificationCode = crypto.randomInt(100000, 999999).toString();

    verificationCodes[email] = {
      code: verificationCode,
      firstName,
      lastName,
      password,
      expiresAt: Date.now() + 15 * 60 * 1000
    };

    const mailOptions = {
      from: EMAIL_USER,
      to: email,
      subject: "Шестцифрен код за потвърждение от ТийнБюджет",
      html: `
      <div style="text-align: center; background-color: rgba(244, 211, 139, 0.5); margin: 2% 3%; padding: 3% 1%; border: 4px dotted rgb(178, 50, 0); border-radius: 20px">
        <h2>Благодарим Ви за регистрацията в <span style="color: rgb(178, 50, 0); font-weight: 600;">🕮</span>ТийнБюджет<span style="color: rgb(178, 50, 0); font-weight: 600;">🕮</span></h2>
          <hr style="border: 0.5px solid rgb(178, 50, 0); width: 18%; margin-top: 6%; margin-bottom: 4%"></hr>
        <p>Вашият шестцифрен код е <strong style="font-size: 20px; color: rgb(178, 50, 0)">${verificationCode}</strong>.</p>
      </div>
      <div>
        <p style="border-radius: 5px; background-color: rgba(178, 50, 0, 0.2); text-align: center; font-size: 13px; margin: 5% 25% 0% 25%">Не сте поискали код? Игнорирайте този имейл.</p>
      </div>`
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error)
        return res
          .status(500)
          .json({ error: "Не успяхме да изпратим имейл! :(" });
      res.json({ message: "Кодът за потвърждение е изпратен на вашия имейл!" });
    });
  });
});

app.post("/resend", (req, res) => {
  const { email } = req.body;

  const verificationCode = crypto.randomInt(100000, 999999).toString();

  verificationCodes[email] = {
    ...verificationCodes[email],
    code: verificationCode,
    expiresAt: Date.now() + 15 * 60 * 1000
  };

  const mailOptions = {
    from: EMAIL_USER,
    to: email,
    subject: "Нов шестцифрен код за потвърждение от ТийнБюджет",
    html: `
      <div style="text-align: center; background-color: rgba(244, 211, 139, 0.5); margin: 2% 3%; padding: 3% 1%; border: 4px dotted rgb(178, 50, 0); border-radius: 20px">
        <p>Вашият шестцифрен код е <strong style="font-size: 20px; color: rgb(178, 50, 0)">${verificationCode}</strong>.</p>
      </div>
      <div>
        <p style="border-radius: 5px; background-color: rgba(178, 50, 0, 0.2); text-align: center; font-size: 13px; margin: 5% 25% 0% 25%">Не сте поискали код? Игнорирайте този имейл.</p>
      </div>`
  };

  console.log(verificationCodes[email]);
  transporter.sendMail(mailOptions, (error, info) => {
    if (error)
      return res
        .status(500)
        .json({ error: "Не успяхме да изпратим имейл! :(" });
    res.json({ message: "Кодът за потвърждение е изпратен на вашия имейл!" });
  });
});

app.post("/verify-email", (req, res) => {
  const { email, verificationCode } = req.body;

  const storedData = verificationCodes[email];
  if (!storedData) {
    return res
      .status(400)
      .json({ error: "Не е намерен код за потвърждение за този имейл." });
  }

  if (Date.now() > storedData.expiresAt) {
    delete verificationCodes[email];
    return res.status(400).json({ error: "Кодът за потвърждение е изтекъл." });
  }

  if (storedData.code !== verificationCode) {
    return res.status(400).json({ error: "Невалиден код за потвърждение." });
  }

  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(storedData.password, salt);

  db.createUser(
    storedData.firstName,
    storedData.lastName,
    email,
    hashedPassword,
    (err, result) => {
      if (err) return res.status(400).json({ error: err.message });

      delete verificationCodes[email];
      res.json({ message: "Успешно регистриран профил!" });
    }
  );
});

app.post("/signin", (req, res) => {
  const { email, password, rememberMe } = req.body;

  db.findUserByEmail(email, (err, results) => {
    if (err) return res.status(400).json({ error: err.message });
    if (results.length === 0)
      return res
        .status(400)
        .json({ error: "Не съществува потребител с този имейл адрес!" });

    const user = results[0];
    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch)
      return res
        .status(400)
        .json({ error: "Въведената парола е грешна или непълна!" });

    const token = jwt.sign({ id: user.id }, SECRET_KEY, {
      expiresIn: rememberMe ? "7d" : "1h"
    });

    const encodedToken = Buffer.from(token).toString("base64");

    res.json({ message: "Успешно влизане!", token: encodedToken });
  });
});

app.post("/password-reset-request", (req, res) => {
  const { email } = req.body;

  db.findUserByEmail(email, (err, results) => {
    if (err) return res.status(400).json({ error: err.message });

    if (results.length === 0) {
      return res
        .status(400)
        .json({ error: "Не съществува потребител с този имейл адрес!" });
    }

    const user = results[0];
    const token = jwt.sign({ id: user.id }, SECRET_KEY, {
      expiresIn: "15m"
    });

    const encodedToken = Buffer.from(token).toString("base64");

    const resetLink = `https://teenbudget.noit.eu/resetpassword/resetbasic/${encodedToken}`;

    const mailOptions = {
      from: EMAIL_USER,
      to: email,
      subject: "Промяна на паролата за ТийнБюджет",
      html: `
      <div style="text-align: center; background-color: rgba(244, 211, 139, 0.5); margin: 2% 3%; padding: 3% 1%; border: 4px dotted rgb(178, 50, 0); border-radius: 20px">
        <h2>Заявка за промяна на парола в <span style="color: rgb(178, 50, 0); font-weight: 600;">💸</span>ТийнБюджет<span style="color: rgb(178, 50, 0); font-weight: 600;">💸</span></h2>
        <p>Натиснете <a href="${resetLink}">тук</a>, за да промените паролата си.</p>
      </div>
      <div>
        <p style="border-radius: 5px; background-color: rgba(178, 50, 0, 0.2); text-align: center; font-size: 13px; margin: 5% 25% 0% 25%">Не сте поискали промяна? Игнорирайте този имейл.</p>
      </div>`
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error)
        return res.status(500).json({ error: "Не успяхме да изпратим имейл!" });
      res.json({
        message: "Линкът за промяна на паролата е изпратен на вашия имейл!"
      });
    });
  });
});

app.post("/password-reset", (req, res) => {
  const { token, newPassword } = req.body;

  let base64Url = token.replace(/-/g, "+").replace(/_/g, "/");

  const padding = base64Url.length % 4;
  if (padding) {
    base64Url += "=".repeat(4 - padding);
  }

  const decodedToken = atob(base64Url);

  jwt.verify(decodedToken, SECRET_KEY, (err, decoded) => {
    if (err) return res.status(400).json({ error: "Invalid or expired token" });

    const userId = decoded.id;

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(newPassword, salt);

    db.updateUserPassword(userId, hashedPassword, (err, result) => {
      if (err) return res.status(400).json({ error: err.message });
      res.json({ message: "Успешно нулиране на паролата!" });
    });
  });
});

app.post("/token-validation", (req, res) => {
  const { token } = req.body;

  let base64Url = token.replace(/-/g, "+").replace(/_/g, "/");

  const padding = base64Url.length % 4;
  if (padding) {
    base64Url += "=".repeat(4 - padding);
  }

  try {
    const decodedToken = atob(base64Url);

    jwt.verify(decodedToken, SECRET_KEY, (err) => {
      if (err) return res.json({ valid: false });
      res.json({ valid: true });
    });
  } catch (error) {
    console.error("Error decoding token: ", error);
    res.json({ valid: false });
  }
});

app.get("/user-data", (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];

  let base64Url = token.replace(/-/g, "+").replace(/_/g, "/");

  const padding = base64Url.length % 4;
  if (padding) {
    base64Url += "=".repeat(4 - padding);
  }

  const decodedToken = atob(base64Url);

  if (!decodedToken) {
    return res.status(401).json({ error: "Token not provided" });
  }

  jwt.verify(decodedToken, SECRET_KEY, (err, decoded) => {
    if (err) return res.status(401).json({ error: "Invalid token" });

    const userId = decoded.id;

    db.getUserById(userId, (err, results) => {
      if (err) return res.status(500).json({ error: "Database query error" });
      if (results.length === 0)
        return res
          .status(404)
          .json({ error: "Не съществува потребител с този имейл адрес!" });

      const user = results[0];
      res.json(user);
    });
  });
});

// Рутове за транзакции
app.post("/transactions", (req, res) => {
  const { type, amount, category, description, date } = req.body;
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Не е предоставен токен" });
  }

  let base64Url = token.replace(/-/g, "+").replace(/_/g, "/");
  const padding = base64Url.length % 4;
  if (padding) {
    base64Url += "=".repeat(4 - padding);
  }

  const decodedToken = atob(base64Url);

  jwt.verify(decodedToken, SECRET_KEY, (err, decoded) => {
    if (err) return res.status(401).json({ error: "Невалиден токен" });
    const userId = decoded.id;

    db.createTransaction(
      userId,
      type,
      amount,
      category,
      description,
      date,
      (err, result) => {
        if (err) {
          console.error("Database error:", err);
          return res.status(500).json({ error: "Грешка в базата данни" });
        }

        db.getTransactionById(result.insertId, (err, transaction) => {
          if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ error: "Грешка в базата данни" });
          }

          res.json({
            message: "Транзакцията е добавена успешно",
            transaction: transaction[0]
          });
        });
      }
    );
  });
});

app.get("/transactions", (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Не е предоставен токен" });
  }

  let base64Url = token.replace(/-/g, "+").replace(/_/g, "/");
  const padding = base64Url.length % 4;
  if (padding) {
    base64Url += "=".repeat(4 - padding);
  }

  const decodedToken = atob(base64Url);

  jwt.verify(decodedToken, SECRET_KEY, (err, decoded) => {
    if (err) return res.status(401).json({ error: "Невалиден токен" });
    const userId = decoded.id;

    db.getTransactionsByUserId(userId, (err, transactions) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ error: "Грешка в базата данни" });
      }

      res.json({ transactions });
    });
  });
});

// Ендпойнт за запазване на финансов анализ
app.post("/save-financial-analysis", (req, res) => {
  const {
    food,
    transport,
    entertainment,
    sport_and_health,
    education,
    clothes,
    others,
    recommendations
  } = req.body;
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Не е предоставен токен" });
  }

  let base64Url = token.replace(/-/g, "+").replace(/_/g, "/");
  const padding = base64Url.length % 4;
  if (padding) {
    base64Url += "=".repeat(4 - padding);
  }

  const decodedToken = atob(base64Url);

  jwt.verify(decodedToken, SECRET_KEY, (err, decoded) => {
    if (err) return res.status(401).json({ error: "Невалиден токен" });
    const userId = decoded.id;

    db.saveFinancialAnalysis(
      userId,
      food,
      transport,
      entertainment,
      sport_and_health,
      education,
      clothes,
      others,
      JSON.stringify(recommendations),
      (err, result) => {
        if (err) {
          console.error("Database error:", err);
          return res.status(500).json({ error: "Грешка в базата данни" });
        }

        res.json({
          message: "Финансовият анализ е запазен успешно",
          analysisId: result.insertId
        });
      }
    );
  });
});

// Ендпойнт за запазване на анализ на таблото
app.post("/save-dashboard-analysis", (req, res) => {
  const {
    summary,
    recommendations,
    savingsPotential,
    monthlyTrend,
    topCategory
  } = req.body;
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Не е предоставен токен" });
  }

  let base64Url = token.replace(/-/g, "+").replace(/_/g, "/");
  const padding = base64Url.length % 4;
  if (padding) {
    base64Url += "=".repeat(4 - padding);
  }

  const decodedToken = atob(base64Url);

  jwt.verify(decodedToken, SECRET_KEY, (err, decoded) => {
    if (err) return res.status(401).json({ error: "Невалиден токен" });
    const userId = decoded.id;

    db.saveDashboardAnalysis(
      userId,
      summary,
      JSON.stringify(recommendations),
      savingsPotential,
      monthlyTrend,
      topCategory,
      (err, result) => {
        if (err) {
          console.error("Database error:", err);
          return res.status(500).json({ error: "Грешка в базата данни" });
        }

        res.json({
          message: "Анализът на таблото е запазен успешно",
          analysisId: result.insertId
        });
      }
    );
  });
});

// Ендпойнт за създаване на цел за спестяване
app.post("/savings-goals", (req, res) => {
  const {
    name,
    targetAmount,
    currentAmount,
    deadline,
    description,
    monthlyIncome,
    milestones,
    aiAnalysis
  } = req.body;
  const token = req.headers.authorization?.split(" ")[1];

  console.log("Received request to create savings goal:", {
    name,
    targetAmount,
    deadline
  });

  if (!token) {
    console.log("No token provided");
    return res.status(401).json({ error: "Не е предоставен токен" });
  }

  let base64Url = token.replace(/-/g, "+").replace(/_/g, "/");
  const padding = base64Url.length % 4;
  if (padding) {
    base64Url += "=".repeat(4 - padding);
  }

  const decodedToken = atob(base64Url);

  jwt.verify(decodedToken, SECRET_KEY, (err, decoded) => {
    if (err) {
      console.log("Token verification failed:", err);
      return res.status(401).json({ error: "Невалиден токен" });
    }
    const userId = decoded.id;
    console.log("Token verified, user ID:", userId);

    // Преобразуване на обектите в JSON стрингове за съхранение в базата данни
    const milestonesJson = JSON.stringify(milestones);
    const aiAnalysisJson = JSON.stringify(aiAnalysis);
    const created_at = new Date();
    const updated_at = new Date();

    console.log("Attempting to save to database with data:", {
      userId,
      name,
      targetAmount,
      currentAmount,
      deadline
    });

    db.createSavingsGoal(
      userId,
      name,
      targetAmount,
      currentAmount || 0,
      deadline,
      description,
      monthlyIncome,
      milestonesJson,
      aiAnalysisJson,
      created_at,
      updated_at,
      (err, result) => {
        if (err) {
          console.error("Database error:", err);
          return res.status(500).json({ error: "Грешка в базата данни" });
        }

        console.log("Successfully saved savings goal:", result);
        res.json({
          message: "Целта за спестяване е добавена успешно",
          goal: {
            id: result.insertId,
            name,
            targetAmount,
            currentAmount: currentAmount || 0,
            deadline,
            description,
            monthlyIncome,
            milestones,
            aiAnalysis
          }
        });
      }
    );
  });
});

// Ендпойнт за зареждане на цели за спестяване
app.get("/savings-goals", (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Не е предоставен токен" });
  }

  let base64Url = token.replace(/-/g, "+").replace(/_/g, "/");
  const padding = base64Url.length % 4;
  if (padding) {
    base64Url += "=".repeat(4 - padding);
  }

  const decodedToken = atob(base64Url);

  jwt.verify(decodedToken, SECRET_KEY, (err, decoded) => {
    if (err) return res.status(401).json({ error: "Невалиден токен" });
    const userId = decoded.id;

    db.query(
      "SELECT * FROM savings_goals WHERE user_id = ? ORDER BY created_at DESC",
      [userId],
      (err, results) => {
        if (err) {
          console.error("Database error:", err);
          return res.status(500).json({ error: "Грешка в базата данни" });
        }

        // Преобразуване на JSON стрингове обратно в обекти
        const goals = results.map((goal) => ({
          ...goal,
          milestones: JSON.parse(goal.milestones),
          aiAnalysis: JSON.parse(goal.ai_analysis)
        }));

        res.json({ goals });
      }
    );
  });
});

// Ендпойнт за получаване на последния анализ на разходите
app.get("/get-last-expense-analysis", (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Не е предоставен токен" });
  }

  let base64Url = token.replace(/-/g, "+").replace(/_/g, "/");
  const padding = base64Url.length % 4;
  if (padding) {
    base64Url += "=".repeat(4 - padding);
  }

  const decodedToken = atob(base64Url);

  jwt.verify(decodedToken, SECRET_KEY, (err, decoded) => {
    if (err) return res.status(401).json({ error: "Невалиден токен" });
    const userId = decoded.id;

    db.getLastExpenseAnalysis(userId, (err, analysis) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ error: "Грешка в базата данни" });
      }

      if (!analysis || analysis.length === 0) {
        return res.json({ message: "Няма намерен анализ" });
      }

      // Преобразуване на JSON стрингове обратно в обекти
      const result = {
        ...analysis[0],
        recommendations: JSON.parse(analysis[0].recommendations)
      };

      res.json(result);
    });
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
