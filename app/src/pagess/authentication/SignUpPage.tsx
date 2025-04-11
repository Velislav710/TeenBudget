import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Footer from '../../components/Footerr/Footer';
import { useTheme } from '../../context/ThemeContext';
import ThemeToggle from '../../components/ThemeToggle';
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';

const SignUpPage = () => {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [errors, setErrors] = useState({
    name: false,
    email: false,
    password: false,
    confirmPassword: false,
  });

  const passwordStrengthRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage('');

    const newErrors = {
      name: !name,
      email: !email,
      password: !password || !passwordStrengthRegex.test(password),
      confirmPassword: !confirmPassword || password !== confirmPassword,
    };

    setErrors(newErrors);

    if (!Object.values(newErrors).includes(true)) {
      setIsLoading(true);
      try {
        const nameParts = name.trim().split(' ');
        const firstName = nameParts[0];
        const lastName =
          nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';

        const body = JSON.stringify({
          firstName,
          lastName,
          email: email.trim(),
          password,
        });

        const response = await fetch(
          `${(import.meta as any).env.VITE_API_BASE_URL}/signup`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body,
          },
        );

        const data = await response.json();

        if (response.ok) {
          alert(
            data.message || 'Кодът за потвърждение е изпратен на вашия имейл!',
          );
          navigate('/verify', {
            state: { email: email },
          });
        } else {
          throw new Error(data.error || 'Грешка при регистрация');
        }
      } catch (error: any) {
        setErrorMessage(error.message || 'Възникна неочаквана грешка');
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
          const response = await fetch(
            `${(import.meta as any).env.VITE_API_BASE_URL}/token-validation`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ token }),
            },
          );

          if (!response.ok) {
            throw new Error('Token validation failed');
          }

          const result = await response.json();

          if (result.valid) {
            navigate(`/main`);
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
                to="/login"
                className={`px-6 py-2 rounded-md ${
                  isDarkMode
                    ? 'bg-sky-500/90 hover:bg-sky-600/90'
                    : 'bg-sky-400/90 hover:bg-sky-500/90'
                } text-white transition-all duration-200`}
              >
                Вход
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
              Създайте акаунт
            </h2>
            <p
              className={`text-center mb-8 ${
                isDarkMode ? 'text-slate-300' : 'text-slate-600'
              }`}
            >
              Въведете вашите данни, за да се регистрирате
            </p>

            {errorMessage && (
              <div className="mb-6 p-3 bg-red-100 text-red-700 rounded-md text-center">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleSignUp} className="space-y-6">
              <div>
                <label
                  className={`block mb-2 font-medium ${
                    isDarkMode ? 'text-slate-200' : 'text-slate-700'
                  }`}
                >
                  Име и фамилия
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <FaUser
                      className={
                        isDarkMode ? 'text-slate-400' : 'text-slate-500'
                      }
                    />
                  </div>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={`w-full pl-10 pr-4 py-3 rounded-xl text-lg transition-all duration-300 ${
                      errors.name
                        ? 'border-red-500 bg-red-50/10 focus:ring-red-500'
                        : isDarkMode
                        ? 'bg-slate-700/50 border-slate-600 text-white placeholder-slate-400 focus:border-sky-500 focus:ring-sky-500'
                        : 'bg-white/70 border-slate-300 text-slate-900 placeholder-slate-400 focus:border-sky-500 focus:ring-sky-500'
                    } border-2 focus:ring-2 focus:outline-none`}
                    placeholder="Въведете вашето име"
                  />
                </div>
                {errors.name && (
                  <p className="mt-2 text-sm font-medium text-red-500">
                    Моля, въведете вашето име
                  </p>
                )}
              </div>

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
                    Паролата трябва да съдържа поне 8 символа, една главна
                    буква, една малка буква, една цифра и един специален символ
                  </p>
                )}
              </div>

              <div>
                <label
                  className={`block mb-2 font-medium ${
                    isDarkMode ? 'text-slate-200' : 'text-slate-700'
                  }`}
                >
                  Потвърдете паролата
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
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`w-full pl-10 pr-12 py-3 rounded-xl text-lg transition-all duration-300 ${
                      errors.confirmPassword
                        ? 'border-red-500 bg-red-50/10 focus:ring-red-500'
                        : isDarkMode
                        ? 'bg-slate-700/50 border-slate-600 text-white placeholder-slate-400 focus:border-sky-500 focus:ring-sky-500'
                        : 'bg-white/70 border-slate-300 text-slate-900 placeholder-slate-400 focus:border-sky-500 focus:ring-sky-500'
                    } border-2 focus:ring-2 focus:outline-none`}
                    placeholder="Потвърдете паролата"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3"
                  >
                    {showConfirmPassword ? (
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
                {errors.confirmPassword && (
                  <p className="mt-2 text-sm font-medium text-red-500">
                    Паролите не съвпадат
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full ${
                  isDarkMode
                    ? 'bg-emerald-500/90 hover:bg-emerald-600/90'
                    : 'bg-emerald-400/90 hover:bg-emerald-500/90'
                } text-white font-bold py-4 rounded-xl transition-all transform hover:scale-105 text-lg shadow-xl ${
                  isLoading ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {isLoading ? 'Регистрация...' : 'Регистрирай се'}
              </button>

              <div className="text-center mt-6">
                <p
                  className={`${
                    isDarkMode ? 'text-slate-300' : 'text-slate-600'
                  }`}
                >
                  Вече имате акаунт?{' '}
                  <Link
                    to="/login"
                    className={`font-bold ${
                      isDarkMode
                        ? 'text-sky-400 hover:text-sky-300'
                        : 'text-sky-600 hover:text-sky-700'
                    }`}
                  >
                    Влезте тук
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

export default SignUpPage;
