import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from './context/ThemeContext';
import ThemeToggle from './components/ThemeToggle';

const ECommerce = () => {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    sessionStorage.removeItem('authToken');
    navigate('../login/');
  };

  return (
    <div className={`min-h-screen ${
      isDarkMode 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' 
        : 'bg-gradient-to-br from-emerald-400 via-yellow-300 to-amber-400'
    }`}>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <h1 className={`text-4xl font-bold ${isDarkMode ? 'text-white' : 'text-amber-950'}`}>
              Моят Бюджет
            </h1>
            <ThemeToggle />
          </div>
          <button
            onClick={handleLogout}
            className={`px-4 py-2 rounded-lg ${
              isDarkMode 
                ? 'bg-red-600 hover:bg-red-700' 
                : 'bg-red-500 hover:bg-red-600'
            } text-white transition-colors font-semibold shadow-lg`}
          >
            Изход
          </button>
        </div>
      </div>
    </div>
  );
};

export default ECommerce;
