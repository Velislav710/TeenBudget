import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Footer from '../../components/Footerr/Footer';
import { useTheme } from '../../context/ThemeContext';
import ThemeToggle from '../../components/ThemeToggle';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';

interface LoginErrors {
  email: boolean;
  password: boolean;
}

const API_BASE_URL =
  (import.meta as any).env.VITE_API_BASE_URL || 'http://localhost:3000';
const LoginPage = () => {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState<LoginErrors>({
    email: false,
    password: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage('');

    const validationErrors = {
      email: !email || !isValidEmail(email),
      password: !password,
    };

    setErrors(validationErrors);

    if (!validationErrors.email && !validationErrors.password) {
      setIsLoading(true);
      try {
        const response = await fetch(`${API_BASE_URL}/signin`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: email.trim(), password, rememberMe }),
        });

        const data = await response.json();
        if (data.token) {
          if (rememberMe) {
            localStorage.setItem('authToken', data.token);
          } else {
            sessionStorage.setItem('authToken', data.token);
          }
          navigate('/main');
        } else {
          throw new Error(data.message || 'Невалидни данни за вход');
        }
      } catch (error: any) {
        setErrorMessage(error.message || 'Възникна грешка при влизането');
      } finally {
        setIsLoading(false);
      }
    }
  };

  React.useEffect(() => {
    const checkTokenValidity = async () => {
      const token =
        localStorage.getItem('authToken') ||
        sessionStorage.getItem('authToken');

      if (token) {
        try {
          const response = await fetch(`${API_BASE_URL}/token-validation`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ token }),
          });

          if (!response.ok) {
            throw new Error('Token validation failed');
          }

          const result = await response.json();

          if (result.valid) {
            navigate('/main');
          } else {
            localStorage.removeItem('authToken');
            sessionStorage.removeItem('authToken');
          }
        } catch (error) {
          console.error('Error validating token:', error);
          localStorage.removeItem('authToken');
          sessionStorage.removeItem('authToken');
        }
      }
    };

    checkTokenValidity();
  }, [navigate]);

  return (
    <div
      className={`min-h-screen ${
        isDarkMode
          ? 'bg-gradient-to-br from-slate-900 via-gray-800 to-slate-900'
          : 'bg-gradient-to-br from-rose-50 via-sky-50 to-teal-50'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 py-8">
        <header
          className={`fixed top-0 right-0 left-0 z-10 ${
            isDarkMode ? 'bg-slate-800/95' : 'bg-white/95'
          } backdrop-blur-sm shadow-sm px-8 py-4`}
        >
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="flex items-center gap-4">
              <h1
                className={`text-2xl font-bold ${
                  isDarkMode ? 'text-white' : 'text-slate-800'
                }`}
              >
                <Link to="/">Тийн Бюджет</Link>
              </h1>
              <ThemeToggle />
            </div>
            <div className="flex items-center gap-4">
              <Link
                to="/signup"
                className={`px-6 py-2 rounded-md ${
                  isDarkMode
                    ? 'bg-emerald-500/90 hover:bg-emerald-600/90'
                    : 'bg-emerald-400/90 hover:bg-emerald-500/90'
                } text-white transition-all duration-200`}
              >
                Създай Акаунт
              </Link>
            </div>
          </div>
        </header>

        <main className="pt-24 flex justify-center items-center min-h-[calc(100vh-180px)]">
          <div
            className={`w-full max-w-md p-8 rounded-2xl ${
              isDarkMode ? 'bg-slate-800/50' : 'bg-white/50'
            } backdrop-blur-sm shadow-lg`}
          >
            <h2
              className={`text-3xl font-bold mb-6 text-center ${
                isDarkMode ? 'text-white' : 'text-slate-800'
              }`}
            >
              Добре дошли отново
            </h2>
            <p
              className={`text-center mb-8 ${
                isDarkMode ? 'text-slate-300' : 'text-slate-600'
              }`}
            >
              Въведете вашите данни за достъп
            </p>

            {errorMessage && (
              <div className="mb-6 p-3 bg-red-100 text-red-700 rounded-md text-center">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label
                  className={`block mb-2 font-medium ${
                    isDarkMode ? 'text-slate-200' : 'text-slate-700'
                  }`}
                >
                  Имейл
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <FaEnvelope
                      className={
                        isDarkMode ? 'text-slate-400' : 'text-slate-500'
                      }
                    />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`w-full pl-10 pr-4 py-3 rounded-xl text-lg transition-all duration-300 ${
                      errors.email
                        ? 'border-red-500 bg-red-50/10 focus:ring-red-500'
                        : isDarkMode
                        ? 'bg-slate-700/50 border-slate-600 text-white placeholder-slate-400 focus:border-sky-500 focus:ring-sky-500'
                        : 'bg-white/70 border-slate-300 text-slate-900 placeholder-slate-400 focus:border-sky-500 focus:ring-sky-500'
                    } border-2 focus:ring-2 focus:outline-none`}
                    placeholder="Въведете вашия имейл"
                  />
                </div>
                {errors.email && (
                  <p className="mt-2 text-sm font-medium text-red-500">
                    Моля, въведете валиден имейл
                  </p>
                )}
              </div>

              <div>
                <label
                  className={`block mb-2 font-medium ${
                    isDarkMode ? 'text-slate-200' : 'text-slate-700'
                  }`}
                >
                  Парола
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <FaLock
                      className={
                        isDarkMode ? 'text-slate-400' : 'text-slate-500'
                      }
                    />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`w-full pl-10 pr-12 py-3 rounded-xl text-lg transition-all duration-300 ${
                      errors.password
                        ? 'border-red-500 bg-red-50/10 focus:ring-red-500'
                        : isDarkMode
                        ? 'bg-slate-700/50 border-slate-600 text-white placeholder-slate-400 focus:border-sky-500 focus:ring-sky-500'
                        : 'bg-white/70 border-slate-300 text-slate-900 placeholder-slate-400 focus:border-sky-500 focus:ring-sky-500'
                    } border-2 focus:ring-2 focus:outline-none`}
                    placeholder="Въведете вашата парола"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3"
                  >
                    {showPassword ? (
                      <FaEyeSlash
                        className={`w-5 h-5 ${
                          isDarkMode ? 'text-slate-400' : 'text-slate-500'
                        } hover:text-sky-500 transition-colors`}
                      />
                    ) : (
                      <FaEye
                        className={`w-5 h-5 ${
                          isDarkMode ? 'text-slate-400' : 'text-slate-500'
                        } hover:text-sky-500 transition-colors`}
                      />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-2 text-sm font-medium text-red-500">
                    Моля, въведете вашата парола
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between">
                <label
                  className={`flex items-center cursor-pointer group ${
                    isDarkMode ? 'text-slate-200' : 'text-slate-700'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="sr-only"
                  />
                  <div
                    className={`w-5 h-5 border-2 rounded transition-all flex items-center justify-center ${
                      rememberMe
                        ? 'bg-sky-500 border-sky-500'
                        : isDarkMode
                        ? 'border-slate-500'
                        : 'border-slate-400'
                    }`}
                  >
                    {rememberMe && (
                      <svg
                        className="w-3 h-3 text-white"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path d="M5 13l4 4L19 7"></path>
                      </svg>
                    )}
                  </div>
                  <span className="ml-2 font-medium">Запомни ме</span>
                </label>
                <Link
                  to="/forgot-password"
                  className={`font-medium ${
                    isDarkMode
                      ? 'text-sky-400 hover:text-sky-300'
                      : 'text-sky-600 hover:text-sky-700'
                  } transition-colors`}
                >
                  Забравена парола?
                </Link>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full ${
                  isDarkMode
                    ? 'bg-sky-500/90 hover:bg-sky-600/90'
                    : 'bg-sky-400/90 hover:bg-sky-500/90'
                } text-white font-bold py-4 rounded-xl transition-all transform hover:scale-105 text-lg shadow-xl ${
                  isLoading ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {isLoading ? 'Вход...' : 'Вход'}
              </button>

              <div className="text-center mt-6">
                <p
                  className={`${
                    isDarkMode ? 'text-slate-300' : 'text-slate-600'
                  }`}
                >
                  Нямате акаунт?{' '}
                  <Link
                    to="/signup"
                    className={`font-bold ${
                      isDarkMode
                        ? 'text-emerald-400 hover:text-emerald-300'
                        : 'text-emerald-600 hover:text-emerald-700'
                    }`}
                  >
                    Регистрирайте се
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default LoginPage;
