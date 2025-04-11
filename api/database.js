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
      JSON.stringify(recommendations) // Convert recommendations to a JSON string
    ],
    callback
  );
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

  console.log("Executing Query: ", query);
  console.log("With Values: ", values);

  db.query(query, values, (error, results) => {
    if (error) {
      console.error("Database Error:", error);
      return callback(error, null);
    }
    console.log("Insert Successful:", results);
    callback(null, results);
  });
};

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
      console.error("DB Query Error:", err);
      return callback(err, null);
    }

    if (!results.length) return callback(null, null);

    const analysis = results[0];

    try {
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
      console.error("Error parsing JSON from DB:", parseError);
      callback(parseError, null);
    }
  });
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
  insertFinancialAnalysis,
  createAIanalysis,
  getLastAIanalysis,
  createSavingsGoal
};
