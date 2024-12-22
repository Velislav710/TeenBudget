import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import WelcomePage from './pagess/landing/WelcomePage.tsx'
import LoginPage from './pagess/authentication/LoginPage';
import SignUpPage from './pagess/authentication/SignUpPage';
import ECommerce from './pagess/home/ECommerce';
import ProtectedRoute from './layout/ProtectedRoute';
import VerifyPage from './pagess/authentication/VerifyPage';
import ForgotPassword from './pagess/authentication/ForgotPassword';
import Resetbasic from './pagess/authentication/Resetbasic';

const App = () => {
  return (
    <ThemeProvider>
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/verify" element={<VerifyPage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
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
      </Routes>
    </ThemeProvider>
  );
};

export default App;
