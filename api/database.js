const mysql = require("mysql2");
require("dotenv").config();

const db = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "teenbudget"
});

db.connect((err) => {
  if (err) {
    console.error("Error connecting to database:", err);
    return;
  }
  console.log("Connected to database");

  // Създаване на таблици, ако не съществуват
  createTables();
});

const createTables = () => {
  // Таблица за потребители
  db.query(
    `CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      first_name VARCHAR(255) NOT NULL,
      last_name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,
    (err) => {
      if (err) console.error("Error creating users table:", err);
      else console.log("Users table ready");
    }
  );

  // Таблица за транзакции
  db.query(
    `CREATE TABLE IF NOT EXISTS transactions (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      type ENUM('income', 'expense') NOT NULL,
      amount DECIMAL(10, 2) NOT NULL,
      category VARCHAR(255) NOT NULL,
      description TEXT,
      date DATE NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )`,
    (err) => {
      if (err) console.error("Error creating transactions table:", err);
      else console.log("Transactions table ready");
    }
  );

  // Таблица за финансови анализи
  db.query(
    `CREATE TABLE IF NOT EXISTS financial_analysis (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      food DECIMAL(10, 2) NOT NULL,
      transport DECIMAL(10, 2) NOT NULL,
      entertainment DECIMAL(10, 2) NOT NULL,
      sport_and_health DECIMAL(10, 2) NOT NULL,
      education DECIMAL(10, 2) NOT NULL,
      clothes DECIMAL(10, 2) NOT NULL,
      others DECIMAL(10, 2) NOT NULL,
      recommendations TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )`,
    (err) => {
      if (err) console.error("Error creating financial_analysis table:", err);
      else console.log("Financial analysis table ready");
    }
  );

  // Таблица за анализи на таблото
  db.query(
    `CREATE TABLE IF NOT EXISTS dashboard_analysis (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      summary TEXT NOT NULL,
      recommendations TEXT NOT NULL,
      savings_potential VARCHAR(50) NOT NULL,
      monthly_trend TEXT NOT NULL,
      top_category VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )`,
    (err) => {
      if (err) console.error("Error creating dashboard_analysis table:", err);
      else console.log("Dashboard analysis table ready");
    }
  );

  // Таблица за цели за спестяване
  db.query(
    `CREATE TABLE IF NOT EXISTS savings_goals (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      name VARCHAR(255) NOT NULL,
      target_amount DECIMAL(10, 2) NOT NULL,
      current_amount DECIMAL(10, 2) DEFAULT 0,
      deadline DATE NOT NULL,
      description TEXT,
      monthly_income VARCHAR(50),
      milestones TEXT,
      ai_analysis TEXT,
      created_at DATETIME NOT NULL,
      updated_at DATETIME NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )`,
    (err) => {
      if (err) console.error("Error creating savings_goals table:", err);
      else console.log("Savings goals table ready");
    }
  );
};

// Функции за работа с потребители
const checkEmailExists = (email, callback) => {
  db.query("SELECT * FROM users WHERE email = ?", [email], callback);
};

const createUser = (firstName, lastName, email, password, callback) => {
  const query =
    "INSERT INTO users (first_name, last_name, email, password) VALUES (?, ?, ?, ?)";
  db.query(query, [firstName, lastName, email, password], callback);
};

const findUserByEmail = (email, callback) => {
  db.query("SELECT * FROM users WHERE email = ?", [email], callback);
};

const getUserById = (id, callback) => {
  db.query(
    "SELECT id, first_name, last_name, email, created_at FROM users WHERE id = ?",
    [id],
    callback
  );
};

const updateUserPassword = (id, password, callback) => {
  db.query(
    "UPDATE users SET password = ? WHERE id = ?",
    [password, id],
    callback
  );
};

// Функции за работа с транзакции
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

const getTransactionsByUserId = (userId, callback) => {
  db.query(
    "SELECT * FROM transactions WHERE user_id = ? ORDER BY date DESC",
    [userId],
    callback
  );
};

const getTransactionById = (id, callback) => {
  db.query("SELECT * FROM transactions WHERE id = ?", [id], callback);
};

// Функции за работа с финансови анализи
const saveFinancialAnalysis = (
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
      recommendations
    ],
    callback
  );
};

const getLastExpenseAnalysis = (userId, callback) => {
  db.query(
    "SELECT * FROM financial_analysis WHERE user_id = ? ORDER BY created_at DESC LIMIT 1",
    [userId],
    callback
  );
};

// Функции за работа с анализи на таблото
const saveDashboardAnalysis = (
  userId,
  summary,
  recommendations,
  savingsPotential,
  monthlyTrend,
  topCategory,
  callback
) => {
  const query =
    "INSERT INTO dashboard_analysis (user_id, summary, recommendations, savings_potential, monthly_trend, top_category) VALUES (?, ?, ?, ?, ?, ?)";
  db.query(
    query,
    [
      userId,
      summary,
      recommendations,
      savingsPotential,
      monthlyTrend,
      topCategory
    ],
    callback
  );
};

// Функции за работа с цели за спестяване
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
  console.log("Creating savings goal in database with params:", {
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
        console.error("Error in createSavingsGoal:", err);
        if (err.code === "ER_NO_SUCH_TABLE") {
          console.log("Table does not exist, attempting to create it...");
          createTables();
        }
        return callback(err);
      }
      console.log("Successfully created savings goal:", result);
      callback(null, result);
    }
  );
};

const getSavingsGoalsByUserId = (userId, callback) => {
  db.query(
    "SELECT * FROM savings_goals WHERE user_id = ? ORDER BY created_at DESC",
    [userId],
    callback
  );
};

const updateSavingsGoal = (goalId, currentAmount, milestones, callback) => {
  const query =
    "UPDATE savings_goals SET current_amount = ?, milestones = ?, updated_at = NOW() WHERE id = ?";
  db.query(query, [currentAmount, milestones, goalId], callback);
};

const deleteSavingsGoal = (goalId, callback) => {
  db.query("DELETE FROM savings_goals WHERE id = ?", [goalId], callback);
};

module.exports = {
  checkEmailExists,
  createUser,
  findUserByEmail,
  getUserById,
  updateUserPassword,
  createTransaction,
  getTransactionsByUserId,
  getTransactionById,
  saveFinancialAnalysis,
  getLastExpenseAnalysis,
  saveDashboardAnalysis,
  createSavingsGoal,
  getSavingsGoalsByUserId,
  updateSavingsGoal,
  deleteSavingsGoal,
  query: (query, params, callback) => db.query(query, params, callback)
};
