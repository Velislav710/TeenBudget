const mysql = require("mysql2");
const dbOpts = require("./config.js").dbOpts;
const dbOptsLocal = require("./config.js").dbOptsLocal;

const db = mysql.createConnection(dbOptsLocal);

db.connect((err) => {
  if (err) throw err;
  console.log("MySQL Connected...");
});

// Функции за потребители
const checkEmailExists = (email, callback) => {
  const query = "SELECT * FROM users WHERE email = ?";
  db.query(query, [email], callback);
};

const createUser = (firstName, lastName, email, hashedPassword, callback) => {
  const query =
    "INSERT INTO users (first_name, last_name, email, password) VALUES (?, ?, ?, ?)";
  db.query(query, [firstName, lastName, email, hashedPassword], callback);
};

const findUserByEmail = (email, callback) => {
  const query = "SELECT * FROM users WHERE email = ?";
  db.query(query, [email], callback);
};

const updateUserPassword = (userId, hashedPassword, callback) => {
  const query = "UPDATE users SET password = ? WHERE id = ?";
  db.query(query, [hashedPassword, userId], callback);
};

const getUserById = (userId, callback) => {
  const query =
    "SELECT id, first_name, last_name, email FROM users WHERE id = ?";
  db.query(query, [userId], callback);
};

// Функции за транзакции
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
  const query =
    "SELECT * FROM transactions WHERE user_id = ? ORDER BY date DESC";
  db.query(query, [userId], callback);
};

const deleteTransactionsByUserId = (userId, callback) => {
  const query = "DELETE FROM transactions WHERE user_id = ?";
  db.query(query, [userId], callback);
};

const insertDashboardAnalysis = (userId, data, callback) => {
  const query = `
    INSERT INTO dashboard_analysis 
    (user_id, summary, recommendations, savings_potential, monthly_trend, top_category) 
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  const values = [
    userId,
    data.summary,
    JSON.stringify(data.recommendations), // Store as JSON string
    data.savingsPotential,
    data.monthlyTrend,
    data.topCategory
  ];

  db.query(query, values, callback);
};

const createAIanalysis = (
  userId,
  total_income,
  total_expense,
  total_balance,
  savings_rate,
  main_findings,
  key_insights,
  risk_areas,
  date,
  callback
) => {
  const query =
    "INSERT INTO expense_analysis (user_id, total_income, total_expense, total_balance, savings_rate, main_findings, key_insights, risk_areas, date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
  db.query(
    query,
    [
      userId,
      total_income,
      total_expense,
      total_balance,
      savings_rate,
      main_findings,
      key_insights,
      risk_areas,
      date
    ],
    callback
  );
};

module.exports = {
  checkEmailExists,
  createUser,
  findUserByEmail,
  updateUserPassword,
  getUserById,
  createTransaction,
  getTransactionsByUserId,
  deleteTransactionsByUserId,
  insertDashboardAnalysis,
  createAIanalysis
};
