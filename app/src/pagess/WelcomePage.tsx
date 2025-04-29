import React from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footerr/Footer';
import { useTheme } from '../context/ThemeContext';
import ThemeToggle from '../components/ThemeToggle';

const WelcomePage = () => {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();

  return (
    <div className={isDarkMode ? 'dark' : ''}>
      <div className={`min-h-screen ${
        isDarkMode 
          ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white' 
          : 'bg-gradient-to-br from-emerald-400 via-yellow-300 to-amber-400'
      } flex flex-col`}>
        <div className="absolute top-4 right-4">
          <ThemeToggle />
        </div>
        
        <div className="flex-grow flex items-center justify-center p-6">
          <div className={`max-w-4xl mx-auto text-center ${
            isDarkMode ? 'bg-gray-800/90' : 'bg-white/90'
          } rounded-2xl p-12 shadow-2xl backdrop-blur-sm`}>
            <h1 className={`text-6xl font-bold ${
              isDarkMode ? 'text-white' : 'text-amber-950'
            } mb-6`}>
              Добре дошли в TeenBudget
            </h1>
            <p className={`text-2xl ${
              isDarkMode ? 'text-gray-300' : 'text-amber-900'
            } mb-12 max-w-2xl mx-auto`}>
              Мощни анализи и красиви визуализации за вашия бюджет
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <button 
                onClick={() => navigate('/signup')}
                className={`px-10 py-5 ${
                  isDarkMode 
                    ? 'bg-emerald-600 hover:bg-emerald-700' 
                    : 'bg-emerald-500 hover:bg-emerald-600'
                } text-white rounded-xl font-bold transition-all transform hover:scale-105 shadow-xl`}
              >
                Създай Акаунт
              </button>
              
              <button 
                onClick={() => navigate('/login')}
                className={`px-10 py-5 ${
                  isDarkMode 
                    ? 'border-3 border-gray-500 text-white hover:bg-gray-700' 
                    : 'border-3 border-amber-500 text-amber-900 hover:bg-amber-400'
                } rounded-xl font-bold transition-all transform hover:scale-105 shadow-xl`}
              >
                Вход
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default WelcomePage;
