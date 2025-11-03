import React, { useCallback, useRef, useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import ThemeToggle from '../../components/ThemeToggle';
import Footer from '../../components/Footerr/Footer';

const VerifyPage = () => {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const inputRefs: any = {
    one: useRef(null),
    two: useRef(null),
    three: useRef(null),
    four: useRef(null),
    five: useRef(null),
    six: useRef(null),
  };

  const [alerts, setAlerts] = useState<
    { message: string; color: string; icon: JSX.Element }[]
  >([]);
  const [isResending, setIsResending] = useState(false);
  const location = useLocation();
  const { email } = location.state as { email: string };

  React.useEffect(() => {
    // Check if user is already logged in
    const token =
      localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
    if (token) {
      // Redirect to the app if token exists
      navigate(`/main`);
    }
  }, [navigate]);

  const handleInputChange = useCallback(
    (currentId: any, nextId: any) => {
      const currentInput = inputRefs[currentId].current;

      if (currentInput && currentInput.value.length === 1) {
        const nextInput = inputRefs[nextId] ? inputRefs[nextId].current : null;

        if (nextInput) {
          nextInput.focus();
        }
      }
    },
    [inputRefs],
  );

  const handleVerification = async () => {
    const verificationCode =
      inputRefs.one.current.value +
      inputRefs.two.current.value +
      inputRefs.three.current.value +
      inputRefs.four.current.value +
      inputRefs.five.current.value +
      inputRefs.six.current.value;

    try {
      const response = await fetch(
        `${(import.meta as any).env.VITE_API_BASE_URL}/verify-email`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, verificationCode }),
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Неуспешно потвърждение!');
      }

      const data = await response.json();

      setAlerts([
        {
          message: data.message,
          color: 'success',
          icon: <i className="ri-check-line"></i>,
        },
      ]);

      setTimeout(() => {
        navigate(`/login`);
      }, 1000);
    } catch (error: any) {
      setAlerts([
        {
          message: error.message,
          color: 'danger',
          icon: <i className="ri-error-warning-fill"></i>,
        },
      ]);
    }
  };

  const handleResendCode = async () => {
    setIsResending(true);
    try {
      const response = await fetch(
        `${(import.meta as any).env.VITE_API_BASE_URL}/resend-code`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email }),
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Неуспешно повторно изпращане!');
      }

      const data = await response.json();

      setAlerts([
        {
          message: data.message,
          color: 'success',
          icon: <i className="ri-check-line"></i>,
        },
      ]);
    } catch (error: any) {
      setAlerts([
        {
          message: error.message,
          color: 'danger',
          icon: <i className="ri-error-warning-fill"></i>,
        },
      ]);
    } finally {
      setIsResending(false);
    }
  };

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
              Потвърждение
            </h2>
            <p
              className={`text-center mb-8 ${
                isDarkMode ? 'text-slate-300' : 'text-slate-600'
              }`}
            >
              Попълнете 6-цифрения код, изпратен на вашата поща {email}
            </p>

            {alerts.map((alert, idx) => (
              <div
                className={`mb-6 p-3 ${
                  alert.color === 'success'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700'
                } rounded-md text-center`}
                role="alert"
                key={idx}
              >
                {alert.icon}
                <span className="ml-2">{alert.message}</span>
              </div>
            ))}

            <div className="space-y-6">
              <div>
                <label
                  className={`block mb-2 font-medium text-center ${
                    isDarkMode ? 'text-slate-200' : 'text-slate-700'
                  }`}
                >
                  Код за потвърждение
                </label>
                <div className="flex justify-center gap-2 mb-4">
                  {['one', 'two', 'three', 'four', 'five', 'six'].map(
                    (id, index) => (
                      <input
                        key={id}
                        type="text"
                        className={`w-12 h-12 text-center text-xl font-bold rounded-lg transition-all duration-300 ${
                          isDarkMode
                            ? 'bg-slate-700/50 border-slate-600 text-white focus:border-sky-500 focus:ring-sky-500'
                            : 'bg-white/70 border-slate-300 text-slate-900 focus:border-sky-500 focus:ring-sky-500'
                        } border-2 focus:ring-2 focus:outline-none`}
                        required
                        maxLength={1}
                        onChange={() =>
                          handleInputChange(
                            id,
                            ['one', 'two', 'three', 'four', 'five', 'six'][
                              index + 1
                            ],
                          )
                        }
                        ref={inputRefs[id]}
                      />
                    ),
                  )}
                </div>
              </div>

              <button
                onClick={handleVerification}
                className={`w-full ${
                  isDarkMode
                    ? 'bg-sky-500/90 hover:bg-sky-600/90'
                    : 'bg-sky-400/90 hover:bg-sky-500/90'
                } text-white font-bold py-4 rounded-xl transition-all transform hover:scale-105 text-lg shadow-xl`}
              >
                Потвърди
              </button>

              <div className="text-center mt-6">
                <p
                  className={`${
                    isDarkMode ? 'text-slate-300' : 'text-slate-600'
                  }`}
                >
                  Не получихте код?{' '}
                  <button
                    onClick={handleResendCode}
                    disabled={isResending}
                    className={`font-bold ${
                      isDarkMode
                        ? 'text-emerald-400 hover:text-emerald-300'
                        : 'text-emerald-600 hover:text-emerald-700'
                    } ${isResending ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {isResending ? 'Изпращане...' : 'Изпрати отново'}
                  </button>
                </p>
              </div>

              <div className="text-center mt-2">
                <p
                  className={`text-sm ${
                    isDarkMode ? 'text-red-300' : 'text-red-600'
                  }`}
                >
                  <i className="ri-asterisk text-xs align-top"></i> Не
                  споделяйте този код с никого!
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default VerifyPage;
