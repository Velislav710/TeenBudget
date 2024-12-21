import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import WelcomePage from './pagess/WelcomePage';
import LoginPage from './pagess/LoginPage';
import SignUpPage from './pagess/SignUpPage';
import ECommerce from './ECommerce';
import ProtectedRoute from './layout/ProtectedRoute';
import VerifyPage from './pagess/VerifyPage';
import ForgotPassword from './components/ForgotPassword';
import Resetbasic from './components/Resetbasic';

const App = () => {
  return (
    <ThemeProvider>
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/verify" element={<VerifyPage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/resetbasic/:token" element={<Resetbasic />} />


        <Route
          path="/main"
          element={
            <ProtectedRoute>
              <ECommerce />
            </ProtectedRoute>
          }
        />
      </Routes>
    </ThemeProvider>
  );
};

export default App;

