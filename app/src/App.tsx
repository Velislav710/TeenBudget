import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import WelcomePage from './pages/landing/WelcomePage.tsx';
import LoginPage from './pages/authentication/LoginPage';
import SignUpPage from './pages/authentication/SignUpPage';
import ECommerce from './pages/home/ECommerce';
import ProtectedRoute from './layout/ProtectedRoute';
import VerifyPage from './pages/authentication/VerifyPage';
import ForgotPassword from './pages/authentication/ForgotPassword';
import Resetbasic from './pages/authentication/Resetbasic';
import Contact from './pages/contact/Contact';
import BudgetPlanning from './pages/home/BudgetPlanning';
import SavingsGoals from './pages/home/SavingsGoals';
import ExpenseAnalytics from './pages/home/expenseanalytics/ExpenseAnalytics';
import FinancialEducation from './pages/home/FinancialEducation';
import Reports from './pages/home/Reports';
import Settings from './pages/home/Settings';

const App = () => {
  return (
    <ThemeProvider>
      <Routes>
        <Route path="*" element={<Navigate to="/main" />} />
        <Route path="/" element={<WelcomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/verify" element={<VerifyPage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/contact" element={<Contact />} />
        <Route
          path="resetpassword/resetbasic/:token"
          element={<Resetbasic />}
        />

        <Route
          path="/main"
          element={
            <ProtectedRoute>
              <ECommerce />
            </ProtectedRoute>
          }
        />
        <Route
          path="/home/budget-planning"
          element={
            <ProtectedRoute>
              <BudgetPlanning />
            </ProtectedRoute>
          }
        />
        <Route path="/home/savings-goals" element={<SavingsGoals />} />
        <Route
          path="/home/expense-analytics"
          element={
            <ProtectedRoute>
              <ExpenseAnalytics />
            </ProtectedRoute>
          }
        />
        <Route
          path="/home/financial-education"
          element={
            <ProtectedRoute>
              <FinancialEducation />
            </ProtectedRoute>
          }
        />
        <Route
          path="/home/reports"
          element={
            <ProtectedRoute>
              <Reports />
            </ProtectedRoute>
          }
        />
        <Route
          path="/home/settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />
      </Routes>
    </ThemeProvider>
  );
};

export default App;
