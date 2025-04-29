import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Footer from '../components/Footerr/Footer';
import { useTheme } from '../context/ThemeContext';
import ThemeToggle from '../components/ThemeToggle';

const SignUpPage = () => {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({
    name: false,
    email: false,
    password: false,
    confirmPassword: false
  });

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const newErrors = {
      name: !name,
      email: !email,
      password: !password,
      confirmPassword: !confirmPassword || password !== confirmPassword
    };

    setErrors(newErrors);

    if (!Object.values(newErrors).includes(true)) {
      try {
        const nameParts = name.trim().split(' ');
        const formData = new FormData();
        formData.append('firstName', nameParts[0]);
        formData.append('lastName', nameParts.length > 1 ? nameParts.slice(1).join(' ') : '');
        formData.append('email', email.trim());
        formData.append('password', password);

        const response = await fetch('http://localhost/teenbudget/register.php', {
          method: 'POST',
          body: formData
        });

        const data = await response.json();
        
        if (data.success) {
          navigate('/login');
        } else {
          throw new Error(data.message || 'Грешка при регистрация');
        }
      } catch (error: any) {
        alert(error.message || 'Възникна неочаквана грешка');
      }
    }
  };

  const inputClasses = (error: boolean) => `
    w-full px-4 py-3 rounded-xl text-lg transition-all duration-300
    ${isDarkMode
      ? error
        ? 'bg-red-900/20 border-2 border-red-500 text-white placeholder-red-400'
        : 'bg-gray-700/50 border-2 border-gray-600 text-white placeholder-gray-400 focus:border-emerald-500'
      : error
        ? 'bg-red-50 border-2 border-red-500 text-red-900 placeholder-red-400'
        : 'bg-white border-2 border-amber-300 text-amber-900 placeholder-amber-400 focus:border-emerald-500'
    }
  `;

  return (
    <div className={isDarkMode ? 'dark' : ''}>
      <div className={`min-h-screen ${
        isDarkMode 
          ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' 
          : 'bg-gradient-to-r from-emerald-400 to-amber-400'
      } flex flex-col`}>
        <div className="absolute top-4 right-4">
          <ThemeToggle />
        </div>

        <div className="flex-grow flex items-center justify-center p-6">
          <form onSubmit={handleSignUp} className={`w-full max-w-md ${
            isDarkMode ? 'bg-gray-800/90' : 'bg-white/95'
          } rounded-2xl shadow-2xl p-10 backdrop-blur-sm`}>
            
            <div className="mb-10 text-center">
              <h1 className={`text-4xl font-bold ${isDarkMode ? 'text-white' : 'text-amber-950'}`}>
                Създаване на акаунт
              </h1>
              <p className={`mt-3 text-lg ${isDarkMode ? 'text-gray-300' : 'text-amber-900'}`}>
                Присъединете се към нашата общност
              </p>
            </div>

            <div className="space-y-5">
              <div>
                <label className={`text-base font-semibold block mb-2 ${
                  isDarkMode ? 'text-gray-200' : 'text-amber-900'
                }`}>
                  Име и фамилия
                </label>
                <input 
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={inputClasses(errors.name)}
                  placeholder="Въведете вашето име"
                />
                {errors.name && (
                  <p className="mt-2 text-sm font-medium text-red-500">
                    Моля, въведете вашето име
                  </p>
                )}
              </div>

              <div>
                <label className={`text-base font-semibold block mb-2 ${
                  isDarkMode ? 'text-gray-200' : 'text-amber-900'
                }`}>
                  Имейл
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
                    Моля, въведете вашия имейл
                  </p>
                )}
              </div>

              <div>
                <label className={`text-base font-semibold block mb-2 ${
                  isDarkMode ? 'text-gray-200' : 'text-amber-900'
                }`}>
                  Парола
                </label>
                <div className="relative">
                  <input 
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={inputClasses(errors.password)}
                    placeholder="Въведете парола"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={`absolute right-3 top-1/2 -translate-y-1/2 ${
                      isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-amber-700 hover:text-amber-800'
                    }`}
                  >
                    {showPassword ? (
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    ) : (
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-2 text-sm font-medium text-red-500">
                    Моля, въведете парола
                  </p>
                )}
              </div>

              <div>
                <label className={`text-base font-semibold block mb-2 ${
                  isDarkMode ? 'text-gray-200' : 'text-amber-900'
                }`}>
                  Потвърдете паролата
                </label>
                <div className="relative">
                  <input 
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={inputClasses(errors.confirmPassword)}
                    placeholder="Потвърдете паролата"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className={`absolute right-3 top-1/2 -translate-y-1/2 ${
                      isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-amber-700 hover:text-amber-800'
                    }`}
                  >
                    {showConfirmPassword ? (
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    ) : (
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
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
                className={`w-full ${
                  isDarkMode 
                    ? 'bg-emerald-600 hover:bg-emerald-700' 
                    : 'bg-emerald-500 hover:bg-emerald-600'
                } text-white font-bold py-4 rounded-xl transition-all transform hover:scale-105 text-lg shadow-xl mt-6`}
              >
                Създай акаунт
              </button>

              <div className="text-center mt-6">
              <Link 
                  to="/login" 
                  className={`font-bold text-lg ${
                    isDarkMode ? 'text-emerald-400 hover:text-emerald-300' : 'text-emerald-700 hover:text-emerald-800'
                  }`}
                >
                  Вече имате акаунт? Влезте
                </Link>
              </div>
            </div>
          </form>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default SignUpPage;

