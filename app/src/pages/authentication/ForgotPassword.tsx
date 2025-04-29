import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Footer from '../../components/Footerr/Footer';
import { useTheme } from '../../context/ThemeContext';
import ThemeToggle from '../../components/ThemeToggle';
import { FaEnvelope } from 'react-icons/fa';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      const response = await fetch(
        `${(import.meta as any).env.VITE_API_BASE_URL}/password-reset-request`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email }),
        },
      );

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage(data.message);
        setTimeout(() => navigate('/login'), 3000);
      } else {
        throw new Error(data.error);
      }
    } catch (err: any) {
      setError(err.message || 'Възникна проблем при изпращането на заявката');
    } finally {
      setIsLoading(false);
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
              Забравена парола
            </h2>
            <p
              className={`text-center mb-8 ${
                isDarkMode ? 'text-slate-300' : 'text-slate-600'
              }`}
            >
              Въведете вашия имейл, за да получите линк за възстановяване
            </p>

            {error && (
              <div className="mb-6 p-3 bg-red-100 text-red-700 rounded-md text-center">
                {error}
              </div>
            )}

            {successMessage && (
              <div className="mb-6 p-3 bg-green-100 text-green-700 rounded-md text-center">
                {successMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
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
                      isDarkMode
                        ? 'bg-slate-700/50 border-slate-600 text-white placeholder-slate-400 focus:border-sky-500 focus:ring-sky-500'
                        : 'bg-white/70 border-slate-300 text-slate-900 placeholder-slate-400 focus:border-sky-500 focus:ring-sky-500'
                    } border-2 focus:ring-2 focus:outline-none`}
                    placeholder="Въведете вашия имейл"
                    required
                  />
                </div>
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
                {isLoading ? 'Изпращане...' : 'Изпрати линк за възстановяване'}
              </button>

              <div className="text-center mt-6">
                <p
                  className={`${
                    isDarkMode ? 'text-slate-300' : 'text-slate-600'
                  }`}
                >
                  Спомнихте си паролата?{' '}
                  <Link
                    to="/login"
                    className={`font-bold ${
                      isDarkMode
                        ? 'text-sky-400 hover:text-sky-300'
                        : 'text-sky-600 hover:text-sky-700'
                    }`}
                  >
                    Върнете се към входа
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

export default ForgotPassword;
