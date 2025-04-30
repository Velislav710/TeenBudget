// Импортиране на MySQL библиотеката
const mysql = require("mysql2");

// Импортиране на настройките за базата данни (отдалечени и локални)
const dbOpts = require("./config.js").dbOpts;
const dbOptsLocal = require("./config.js").dbOptsLocal;

// Създаване на връзка с локалната база данни
const db = mysql.createConnection(dbOptsLocal);

// Свързване с базата данни
db.connect((err) => {
  if (err) throw err;
  console.log("MySQL Свързан...");
});

// === ФУНКЦИИ ЗА ПОТРЕБИТЕЛИ ===

// Проверка дали даден имейл вече съществува в базата
=======
// database.js
const mysql = require("mysql2");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

require("dotenv").config();

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "", // Default password for XAMPP
  database: "teenbudget"
});

db.connect((err) => {
  if (err) throw err;
  console.log("MySQL Connected...");
});

// Helper functions
>>>>>>> Stashed changes
const checkEmailExists = (email, callback) => {
  const query = "SELECT * FROM users WHERE email = ?";
  db.query(query, [email], callback);
};

// Създаване на нов потребител
const createUser = (firstName, lastName, email, hashedPassword, callback) => {
  const query =
    "INSERT INTO users (first_name, last_name, email, password) VALUES (?, ?, ?, ?)";
  db.query(query, [firstName, lastName, email, hashedPassword], callback);
};

// Намиране на потребител по имейл
const findUserByEmail = (email, callback) => {
  const query = "SELECT * FROM users WHERE email = ?";
  db.query(query, [email], callback);
};

// Актуализиране на паролата на потребител по ID
const updateUserPassword = (userId, hashedPassword, callback) => {
  const query = "UPDATE users SET password = ? WHERE id = ?";
  db.query(query, [hashedPassword, userId], callback);
};

// Вземане на потребител по ID
const getUserById = (userId, callback) => {
  const query =
    "SELECT id, first_name, last_name, email FROM users WHERE id = ?";
  db.query(query, [userId], callback);
};

// === ФУНКЦИИ ЗА ТРАНЗАКЦИИ ===

// Създаване на нова транзакция
const createTransaction = (
  userId,
  type,
  amount,
  category,
  description,
  date,
  callback
) => {
  const query =
    "INSERT INTO transactions (user_id, type, amount, category, description, date) VALUES (?, ?, ?, ?, ?, ?)";
  db.query(
    query,
    [userId, type, amount, category, description, date],
    callback
  );
};

// Вземане на всички транзакции на потребител, подредени по дата
const getTransactionsByUserId = (userId, callback) => {
  const query =
    "SELECT * FROM transactions WHERE user_id = ? ORDER BY date DESC";
  db.query(query, [userId], callback);
};

const getTransactionsByUserIdAndDateRange = (
  userId,
  startDate,
  endDate,
  callback
) => {
  const query =
    "SELECT * FROM transactions WHERE user_id = ? AND date BETWEEN ? AND ? ORDER BY date DESC";
  db.query(query, [userId, startDate, endDate], callback);
};

// Изтриване на всички транзакции на потребител
const deleteTransactionsByUserId = (userId, callback) => {
  const query = "DELETE FROM transactions WHERE user_id = ?";
  db.query(query, [userId], callback);
};

// Записване на анализ за таблото (dashboard)
const insertDashboardAnalysis = (userId, data, callback) => {
  const query = `
    INSERT INTO dashboard_analysis 
    (user_id, summary, recommendations, savings_potential, monthly_trend, top_category) 
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  const values = [
    userId,
    data.summary,
    JSON.stringify(data.recommendations), // Запис като JSON низ
    data.savingsPotential,
    data.monthlyTrend,
    data.topCategory
  ];

  db.query(query, values, callback);
};

// Записване на финансов анализ
const insertFinancialAnalysis = (
  userId,
  food,
  transport,
  entertainment,
  sport_and_health,
  education,
  clothes,
  others,
  recommendations,
  callback
) => {
  const query =
    "INSERT INTO financial_analysis (user_id, food, transport, entertainment, sport_and_health, education, clothes, others, recommendations) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
  db.query(
    query,
    [
      userId,
      food,
      transport,
      entertainment,
      sport_and_health,
      education,
      clothes,
      others,
      JSON.stringify(recommendations) // Преобразуване на препоръките в JSON низ
    ],
    callback
  );
};

// Създаване на AI-базиран анализ
const createAIanalysis = (
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
  callback
) => {
  const query = `
    INSERT INTO expense_analysis (
      user_id, total_income, total_expense, total_balance, savings_rate, main_findings, 
      key_insights, risk_areas, top_category, category_breakdown, spending_patterns, 
      emotional_triggers, social_factors, immediate_recommendations, short_term_recommendations, 
      long_term_recommendations, financial_literacy, practical_skills, resources, 
      next_month_future_projection, three_month_future_projection, savings_potential_future_projection, date
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
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
    date
  ];

  console.log("Изпълнение на заявка: ", query);
  console.log("С параметри: ", values);

  db.query(query, values, (error, results) => {
    if (error) {
      console.error("Грешка при запис в базата:", error);
      return callback(error, null);
    }
    console.log("Успешно записано:", results);
    callback(null, results);
  });
};

// Вземане на последния AI-анализ
const getLastAIanalysis = (userId, callback) => {
  const query = `
    SELECT main_findings, 
      key_insights, risk_areas, top_category, category_breakdown, spending_patterns, 
      emotional_triggers, social_factors, immediate_recommendations, short_term_recommendations, 
      long_term_recommendations, financial_literacy, practical_skills, resources, 
      next_month_future_projection, three_month_future_projection, savings_potential_future_projection
    FROM expense_analysis
    WHERE user_id = ?
    ORDER BY date DESC
    LIMIT 1;
  `;

  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error("Грешка при заявка към базата:", err);
      return callback(err, null);
    }

    if (!results.length) return callback(null, null);

    const analysis = results[0];

    try {
      // Форматиране на JSON полетата
      const formattedAnalysis = {
        analysis: {
          overallSummary: {
            main_findings: analysis.main_findings,
            key_insights: JSON.parse(analysis.key_insights || "{}"),
            risk_areas: JSON.parse(analysis.risk_areas || "{}")
          },
          categoryAnalysis: {
            topCategory: analysis.top_category,
            categoryBreakdown: JSON.parse(analysis.category_breakdown || "{}")
          },
          behavioralInsights: {
            spendingPatterns: analysis.spending_patterns,
            emotionalTriggers: JSON.parse(analysis.emotional_triggers || "{}"),
            socialFactors: analysis.social_factors
          },
          detailedRecommendations: {
            immediate: JSON.parse(analysis.immediate_recommendations || "{}"),
            shortTerm: JSON.parse(analysis.short_term_recommendations || "{}"),
            longTerm: JSON.parse(analysis.long_term_recommendations || "{}")
          },
          educationalGuidance: {
            financialLiteracy: analysis.financial_literacy,
            practicalSkills: JSON.parse(analysis.practical_skills || "{}"),
            resources: JSON.parse(analysis.resources || "{}")
          },
          futureProjections: {
            nextMonth: analysis.next_month_future_projection,
            threeMonths: analysis.three_month_future_projection,
            savingsPotential: analysis.savings_potential_future_projection
          }
        }
      };

      callback(null, formattedAnalysis);
    } catch (parseError) {
      console.error("Грешка при парсване на JSON:", parseError);
      callback(parseError, null);
    }
  });
};

// === ФУНКЦИИ ЗА ЦЕЛИ ЗА СПЕСТЯВАНЕ ===

// Създаване на нова цел за спестяване
const createSavingsGoal = (
  userId,
  name,
  target_amount,
  current_amount,
  deadline,
  description,
  monthly_income,
  milestones,
  ai_analysis,
  created_at,
  updated_at,
  callback
) => {
  console.log("Създаване на цел за спестяване с параметри:", {
    userId,
    name,
    target_amount,
    current_amount,
    deadline
  });

  const query =
    "INSERT INTO savings_goals (user_id, name, target_amount, current_amount, deadline, description, monthly_income, milestones, ai_analysis, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

  db.query(
    query,
    [
      userId,
      name,
      target_amount,
      current_amount,
      deadline,
      description,
      monthly_income,
      milestones,
      ai_analysis,
      created_at,
      updated_at
    ],
    (err, result) => {
      if (err) {
        console.error("Грешка при createSavingsGoal:", err);
        if (err.code === "ER_NO_SUCH_TABLE") {
          console.log("Таблицата не съществува, ще опитаме да я създадем...");
          createTables(); // Вика се функция за създаване на таблицата, ако не съществува
        }
        return callback(err);
      }
      console.log("Целта за спестяване е създадена успешно:", result);
      callback(null, result);
    }
  );
};

// === ЕКСПОРТ НА ВСИЧКИ ФУНКЦИИ ===
module.exports = {
  checkEmailExists,
  createUser,
  findUserByEmail,
  updateUserPassword,
  getUserById,
  createTransaction,
  getTransactionsByUserId,
  getTransactionsByUserIdAndDateRange,
  deleteTransactionsByUserId,
  insertDashboardAnalysis,
  insertFinancialAnalysis,
  createAIanalysis,
  getLastAIanalysis,
  createSavingsGoal
};
