const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const crypto = require("crypto");
const PDFDocument = require("pdfkit");
const ExcelJS = require("exceljs");
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
      expiresIn: rememberMe ? "7d" : "7d"
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
        if (err)
          return res.status(500).json({ error: "Грешка в базата данни" });

        res.json({
          message: "Транзакцията е добавена успешно",
          transaction: {
            id: result.insertId,
            user_id: userId,
            type,
            amount,
            category,
            description,
            date
          }
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

    db.getTransactionsByUserId(userId, (err, results) => {
      if (err) return res.status(500).json({ error: "Грешка в базата данни" });

      res.json({ transactions: results });
    });
  });
});

app.delete("/transactions", (req, res) => {
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

    db.deleteTransactionsByUserId(userId, (err) => {
      if (err) return res.status(500).json({ error: "Грешка в базата данни" });

      res.json({ message: "Всички транзакции са изтрити успешно" });
    });
  });
});

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

    db.insertDashboardAnalysis(
      userId,
      { summary, recommendations, savingsPotential, monthlyTrend, topCategory },
      (err, result) => {
        if (err)
          return res.status(500).json({ error: "Грешка в базата данни" });
        res.json({ message: "Финансовият анализ е добавен успешно" });
      }
    );
  });
});

app.post("/save-expense-analysis", (req, res) => {
  try {
    const {
      total_income,
      total_expense,
      total_balance,
      savings_rate,
      main_findings,
      key_insights,
      risk_areas,
      top_category,
      category_breakdown,
      spending_patterns,
      emotional_triggers,
      social_factors,
      immediate_recommendations,
      short_term_recommendations,
      long_term_recommendations,
      financial_literacy,
      practical_skills,
      resources,
      next_month_future_projection,
      three_month_future_projection,
      savings_potential_future_projection,
      date
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

      db.createAIanalysis(
        userId,
        total_income,
        total_expense,
        total_balance,
        savings_rate,
        main_findings,
        key_insights,
        risk_areas,
        top_category,
        category_breakdown,
        spending_patterns,
        emotional_triggers,
        social_factors,
        immediate_recommendations,
        short_term_recommendations,
        long_term_recommendations,
        financial_literacy,
        practical_skills,
        resources,
        next_month_future_projection,
        three_month_future_projection,
        savings_potential_future_projection,
        date,
        (err, result) => {
          if (err) {
            return res.status(500).json({ error: "Грешка в базата данни" });
          }
          res.json({ message: "AI анализът е добавен успешно" });
        }
      );
    });
  } catch (error) {
    res.status(400).json({ error: "Невалидни данни" });
  }
});

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

    db.insertFinancialAnalysis(
      userId,
      food,
      transport,
      entertainment,
      sport_and_health,
      education,
      clothes,
      others,
      recommendations,
      (err, result) => {
        if (err)
          return res.status(500).json({ error: "Грешка в базата данни" });
        res.json({ message: "Финансовият анализ е добавен успешно" });
      }
    );
  });
});

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

  try {
    jwt.verify(decodedToken, SECRET_KEY, (err, decoded) => {
      const userId = decoded.id;

      db.getLastAIanalysis(userId, (err, result) => {
        if (err) {
          console.error("Database error:", err);
          return res.status(500).json({ error: "Грешка в базата данни" });
        }

        if (!result || result.length === 0) {
          return res.status(404).json({ error: "Няма записан анализ" });
        }
        res.json(result);
      });
    });
  } catch (error) {
    console.error("JWT error:", error);
    return res.status(401).json({ error: "Невалиден токен" });
  }
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

// PDF Report Generation Endpoint
app.post("/reports/pdf", (req, res) => {
  // Get and validate token
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "Не е предоставен токен" });
  }

  try {
    // Decode token
    let base64Url = token.replace(/-/g, "+").replace(/_/g, "/");
    const padding = base64Url.length % 4;
    if (padding) {
      base64Url += "=".repeat(4 - padding);
    }
    const decodedToken = atob(base64Url);

    // Verify token
    jwt.verify(decodedToken, SECRET_KEY, (err, decoded) => {
      if (err) return res.status(401).json({ error: "Невалиден токен" });

      const userId = decoded.id;
      const { start, end } = req.body;

      // Get transactions for the date range
      db.getTransactionsByUserIdAndDateRange(
        userId,
        start,
        end,
        (err, transactions) => {
          if (err)
            return res.status(500).json({ error: "Грешка в базата данни" });

          // Generate PDF with proper font for Cyrillic characters
          const doc = new PDFDocument({
            font: "times.ttf", // Default font
            size: "A4",
            info: {
              Title: "Финансов отчет",
              Author: "Teen Budget App"
            }
          });

          // Set response headers for PDF download
          res.setHeader("Content-Type", "application/pdf");
          res.setHeader(
            "Content-Disposition",
            "attachment; filename=financial-report.pdf"
          );

          // Pipe the PDF directly to the response
          doc.pipe(res);

          // Register a standard font that supports Cyrillic
          // Note: For full Cyrillic support, you might need to embed a font that supports it

          // Add content to PDF
          doc.fontSize(20).text("Финансов отчет", { align: "center" });
          doc.moveDown();

          const startDate = new Date(start).toLocaleDateString("bg-BG");
          const endDate = new Date(end).toLocaleDateString("bg-BG");
          doc.fontSize(12).text(`Период: ${startDate} - ${endDate}`);
          doc.moveDown();

          // Create table header
          const tableTop = 150;
          let currentTop = tableTop;

          // Headers
          doc.text("Дата", 50, currentTop);
          doc.text("Описание", 150, currentTop);
          doc.text("Категория", 300, currentTop);
          doc.text("Тип", 380, currentTop);
          doc.text("Сума", 450, currentTop);
          currentTop += 20;

          // Draw header underline
          doc
            .moveTo(50, currentTop - 5)
            .lineTo(500, currentTop - 5)
            .stroke();

          // Table content
          let totalIncome = 0;
          let totalExpense = 0;

          transactions.forEach((transaction) => {
            // Format date using Bulgarian locale
            const date = new Date(transaction.date).toLocaleDateString("bg-BG");

            // Ensure text fits in columns with proper encoding
            const description = transaction.description.substring(0, 25);
            const category = transaction.category.substring(0, 20);
            const type = transaction.type === "expense" ? "Разход" : "Приход";

            doc.text(date, 50, currentTop);
            doc.text(description, 150, currentTop);
            doc.text(category, 300, currentTop);
            doc.text(type, 380, currentTop);
            doc.text(transaction.amount.toFixed(2) + " лв.", 450, currentTop);

            currentTop += 20;

            // Track totals by transaction type
            if (transaction.type === "expense") {
              totalExpense += parseFloat(transaction.amount);
            } else {
              totalIncome += parseFloat(transaction.amount);
            }

            // Add new page if needed
            if (currentTop > 700) {
              doc.addPage();
              currentTop = 50;
            }
          });

          // Calculate balance
          const balance = totalIncome - totalExpense;

          // Add summary section
          doc.moveDown();
          doc.text(`Общи приходи: ${totalIncome.toFixed(2)} лв.`, 50);
          doc.text(`Общи разходи: ${totalExpense.toFixed(2)} лв.`, 50);
          doc.text(`Баланс: ${balance.toFixed(2)} лв.`, 50);

          // Finalize the PDF
          doc.end();
        }
      );
    });
  } catch (error) {
    return res.status(500).json({ error: "Грешка при обработка на заявката" });
  }
});

// Excel Report Generation Endpoint
app.post("/reports/excel", (req, res) => {
  // Get and validate token
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "Не е предоставен токен" });
  }

  try {
    // Decode token
    let base64Url = token.replace(/-/g, "+").replace(/_/g, "/");
    const padding = base64Url.length % 4;
    if (padding) {
      base64Url += "=".repeat(4 - padding);
    }
    const decodedToken = atob(base64Url);

    // Verify token
    jwt.verify(decodedToken, SECRET_KEY, (err, decoded) => {
      if (err) return res.status(401).json({ error: "Невалиден токен" });

      const userId = decoded.id;
      const { start, end } = req.body;

      // Get transactions for the date range
      db.getTransactionsByUserIdAndDateRange(
        userId,
        start,
        end,
        (err, transactions) => {
          if (err)
            return res.status(500).json({ error: "Грешка в базата данни" });

          // Create a new Excel workbook
          const workbook = new ExcelJS.Workbook();
          const worksheet = workbook.addWorksheet("Transactions");

          // Add headers
          worksheet.columns = [
            { header: "Дата", key: "date", width: 15 },
            { header: "Описание", key: "description", width: 30 },
            { header: "Категория", key: "category", width: 20 },
            { header: "Тип", key: "type", width: 15 },
            { header: "Сума", key: "amount", width: 15 }
          ];

          // Style the header row
          worksheet.getRow(1).font = { bold: true };

          // Add data
          transactions.forEach((transaction) => {
            worksheet.addRow({
              date: new Date(transaction.date).toLocaleDateString(),
              description: transaction.description,
              category: transaction.category,
              type: transaction.type === "expense" ? "Разход" : "Приход",
              amount: transaction.amount
            });
          });

          // Calculate and add totals
          const totalRow = worksheet.rowCount + 2; // This is where we'll start the summary

          // Add income calculation
          worksheet.getCell(`B${totalRow}`).value = "Общи приходи:";
          worksheet.getCell(`B${totalRow}`).font = { bold: true };
          worksheet.getCell(`E${totalRow}`).value = {
            formula: `SUMIF(D2:D${worksheet.rowCount - 2},"Приход",E2:E${
              worksheet.rowCount - 2
            })`,
            date1904: false
          };
          worksheet.getCell(`E${totalRow}`).font = { bold: true };

          // Add expense calculation
          worksheet.getCell(`B${totalRow + 1}`).value = "Общи разходи:";
          worksheet.getCell(`B${totalRow + 1}`).font = { bold: true };
          worksheet.getCell(`E${totalRow + 1}`).value = {
            formula: `SUMIF(D2:D${worksheet.rowCount - 2},"Разход",E2:E${
              worksheet.rowCount - 2
            })`,
            date1904: false
          };
          worksheet.getCell(`E${totalRow + 1}`).font = { bold: true };

          // Add balance calculation
          worksheet.getCell(`B${totalRow + 2}`).value = "Баланс:";
          worksheet.getCell(`B${totalRow + 2}`).font = { bold: true };
          worksheet.getCell(`E${totalRow + 2}`).value = {
            formula: `E${totalRow}-E${totalRow + 1}`,
            date1904: false
          };
          worksheet.getCell(`E${totalRow + 2}`).font = { bold: true };

          // Set response headers
          res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          );
          res.setHeader(
            "Content-Disposition",
            "attachment; filename=financial-report.xlsx"
          );

          // Write to response
          workbook.xlsx
            .write(res)
            .then(() => {
              res.end();
            })
            .catch((err) => {
              console.error("Excel generation error:", err);
              res
                .status(500)
                .json({ error: "Грешка при генериране на Excel файл" });
            });
        }
      );
    });
  } catch (error) {
    return res.status(500).json({ error: "Грешка при обработка на заявката" });
  }
});

app.listen(5000, () => {
  console.log("Сървърът е стартиран на port 5000");
});
