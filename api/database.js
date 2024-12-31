const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "teenbudget"
});

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

module.exports = {
  db,
  checkEmailExists,
  createUser,
  findUserByEmail,
  updateUserPassword,
  getUserById,
  createTransaction,
  getTransactionsByUserId,
  deleteTransactionsByUserId
};
