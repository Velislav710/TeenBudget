import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Footer from '../../components/Footerr/Footer';
import { useTheme } from '../../context/ThemeContext';
import ThemeToggle from '../../components/ThemeToggle';

interface LoginErrors {
  email: boolean;
  password: boolean;
}

const LoginPage = ({ setIsAuthenticated }: { setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>> }) => {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState<LoginErrors>({ email: false, password: false });

  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newErrors = { 
      email: !email || !isValidEmail(email), 
      password: !password || password.length < 6 
    };

    setErrors(newErrors);

    if (!newErrors.email && !newErrors.password) {
      try {
        const formData = new FormData();
        formData.append('email', email.trim());
        formData.append('password', password);
        formData.append('rememberMe', rememberMe.toString());

        const response = await fetch('http://localhost/teenbudget/login.php', {
          method: 'POST',
          body: formData
        });

        const data = await response.json();

        if (data.success) {
          localStorage.setItem('authToken', data.token);
          setIsAuthenticated(true);
          navigate('/main');
        } else {
          throw new Error(data.message || 'Невалидни данни за вход');
        }
      } catch (error: any) {
        alert(error.message || 'Възникна грешка при влизането');
      }
    }
  };

  const inputClasses = (error: boolean) => `
    w-full px-5 py-4 rounded-md text-lg border-2 transition-all duration-200
    ${isDarkMode
      ? error
        ? 'bg-red-700 border-red-500 text-white'
        : 'bg-gray-800 border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500'
      : error
        ? 'bg-red-100 border-red-500 text-red-900'
        : 'bg-white border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500'
    }
  `;

  return (
    <div className={isDarkMode ? 'dark' : ''}>
      <div className={`min-h-screen ${isDarkMode ? 'bg-gradient-to-r from-gray-900 to-gray-700' : 'bg-gradient-to-r from-blue-400 to-blue-300'} flex flex-col justify-center items-center`}>
        <div className="absolute top-4 right-4">
          <ThemeToggle />
        </div>

        <div className="w-full max-w-md p-8 bg-white/80 rounded-lg shadow-lg backdrop-blur-sm">
          <h1 className={`text-3xl font-semibold text-center ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Влезте в акаунта си
          </h1>
          <p className={`mt-3 text-lg text-center ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Моля, въведете имейл и парола, за да продължите.
          </p>

          <form onSubmit={handleLogin} className="mt-6 space-y-6">
            <div>
              <label className={`block text-sm font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                Вашият имейл
              </label>
              <input 
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClasses(errors.email)}
                placeholder="Въведете вашия имейл"
              />
              {errors.email && (
                <p className="mt-2 text-sm font-medium text-red-500">
                  Невалиден имейл адрес. Моля, опитайте отново.
                </p>
              )}
            </div>

            <div>
              <label className={`block text-sm font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                Парола
              </label>
              <div className="relative">
                <input 
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={inputClasses(errors.password)}
                  placeholder="Вашата парола"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
              {errors.password && (
                <p className="mt-2 text-sm font-medium text-red-500">
                  Паролата трябва да съдържа минимум 6 символа.
                </p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <label className={`flex items-center ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="mr-2"
                />
                Запомни ме за следващия път
              </label>
            </div>

            <button 
              type="submit"
              className={`w-full py-3 rounded-md text-white font-semibold bg-blue-600 ${isDarkMode ? 'hover:bg-blue-500' : 'hover:bg-blue-700'}`}
            >
              Влез
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link 
              to="/signup" 
              className={`text-sm font-semibold ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}
            >
              Нямате акаунт? Регистрирайте се тук.
            </Link>
          </div>
        </div>
        
        <Footer />
      </div>
    </div>
  );
};

export default LoginPage;
