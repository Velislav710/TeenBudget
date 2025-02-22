import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import WelcomePage from './pagess/landing/WelcomePage.tsx';
import LoginPage from './pagess/authentication/LoginPage';
import SignUpPage from './pagess/authentication/SignUpPage';
import ECommerce from './pagess/home/ECommerce';
import ProtectedRoute from './layout/ProtectedRoute';
import VerifyPage from './pagess/authentication/VerifyPage';
import ForgotPassword from './pagess/authentication/ForgotPassword';
import Resetbasic from './pagess/authentication/Resetbasic';
import Contact from './pagess/contact/Contact';
import BudgetPlanning from './pagess/home/BudgetPlanning';
import SavingsGoals from './pagess/home/SavingsGoals';
import ExpenseAnalytics from './pagess/home/ExpenseAnalytics';
import FinancialEducation from './pagess/home/FinancialEducation';
import Reports from './pagess/home/Reports';
import Settings from './pagess/home/Settings';

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
