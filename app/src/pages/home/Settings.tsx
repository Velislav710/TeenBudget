import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import ThemeToggle from '../../components/ThemeToggle';
import SideMenu from '../../components/SideMenu';
import Footer from '../../components/Footerr/Footer';

const Settings = () => {
  const { isDarkMode } = useTheme();

  return (
    <div
      className={`min-h-screen ${
        isDarkMode
          ? 'bg-gradient-to-br from-slate-900 via-gray-800 to-slate-900'
          : 'bg-gradient-to-br from-rose-50 via-sky-50 to-teal-50'
      }`}
    >
      <SideMenu />
      <div className="ml-64">
        <header
          className={`fixed top-0 right-0 left-64 z-10 ${
            isDarkMode ? 'bg-slate-800/95' : 'bg-white/95'
          } backdrop-blur-sm shadow-sm px-8 py-4`}
        >
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <h1
                className={`text-2xl font-bold ${
                  isDarkMode ? 'text-white' : 'text-slate-800'
                }`}
              >
                Настройки
              </h1>
              <ThemeToggle />
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-8 py-8 pt-20">
          {/* Профил настройки */}
          <div
            className={`mb-8 p-6 rounded-xl ${
              isDarkMode ? 'bg-slate-800/50' : 'bg-white/50'
            } backdrop-blur-sm shadow-sm`}
          >
            <h2
              className={`text-xl font-bold mb-6 ${
                isDarkMode ? 'text-white' : 'text-slate-800'
              }`}
            >
              Профил настройки
            </h2>
            <div className="space-y-4">
              <div
                className={`p-4 rounded-lg ${
                  isDarkMode ? 'bg-slate-700/50' : 'bg-slate-50/50'
                }`}
              >
                <label className="block mb-2">Име</label>
                <input
                  type="text"
                  className={`w-full p-2 rounded-lg ${
                    isDarkMode ? 'bg-slate-600 text-white' : 'bg-white'
                  }`}
                  placeholder="Твоето име"
                />
              </div>
              <div
                className={`p-4 rounded-lg ${
                  isDarkMode ? 'bg-slate-700/50' : 'bg-slate-50/50'
                }`}
              >
                <label className="block mb-2">Имейл</label>
                <input
                  type="email"
                  className={`w-full p-2 rounded-lg ${
                    isDarkMode ? 'bg-slate-600 text-white' : 'bg-white'
                  }`}
                  placeholder="твоя@email.com"
                />
              </div>
            </div>
          </div>

          {/* Сигурност */}
          <div
            className={`mb-8 p-6 rounded-xl ${
              isDarkMode ? 'bg-slate-800/50' : 'bg-white/50'
            } backdrop-blur-sm shadow-sm`}
          >
            <h2 className="text-xl font-bold mb-6">Сигурност</h2>
            <div className="space-y-4">
              <div
                className={`p-4 rounded-lg ${
                  isDarkMode ? 'bg-slate-700/50' : 'bg-slate-50/50'
                }`}
              >
                <h3 className="font-medium mb-4">Промяна на парола</h3>
                <div className="space-y-2">
                  <input
                    type="password"
                    className={`w-full p-2 rounded-lg ${
                      isDarkMode ? 'bg-slate-600 text-white' : 'bg-white'
                    }`}
                    placeholder="Текуща парола"
                  />
                  <input
                    type="password"
                    className={`w-full p-2 rounded-lg ${
                      isDarkMode ? 'bg-slate-600 text-white' : 'bg-white'
                    }`}
                    placeholder="Нова парола"
                  />
                  <button
                    className={`px-4 py-2 rounded-lg ${
                      isDarkMode
                        ? 'bg-blue-600 hover:bg-blue-700'
                        : 'bg-blue-500 hover:bg-blue-600'
                    } text-white`}
                  >
                    Промени парола
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Известия */}
          <div
            className={`mb-8 p-6 rounded-xl ${
              isDarkMode ? 'bg-slate-800/50' : 'bg-white/50'
            } backdrop-blur-sm shadow-sm`}
          >
            <h2 className="text-xl font-bold mb-6">Известия</h2>
            <div className="space-y-4">
              <div
                className={`p-4 rounded-lg ${
                  isDarkMode ? 'bg-slate-700/50' : 'bg-slate-50/50'
                }`}
              >
                <label className="flex items-center space-x-3">
                  <input type="checkbox" className="form-checkbox h-5 w-5" />
                  <span>Имейл известия за транзакции</span>
                </label>
              </div>
              <div
                className={`p-4 rounded-lg ${
                  isDarkMode ? 'bg-slate-700/50' : 'bg-slate-50/50'
                }`}
              >
                <label className="flex items-center space-x-3">
                  <input type="checkbox" className="form-checkbox h-5 w-5" />
                  <span>Седмични отчети</span>
                </label>
              </div>
            </div>
          </div>

          {/* Активни сесии */}
          <div
            className={`mb-8 p-6 rounded-xl ${
              isDarkMode ? 'bg-slate-800/50' : 'bg-white/50'
            } backdrop-blur-sm shadow-sm`}
          >
            <h2 className="text-xl font-bold mb-6">Активни сесии</h2>
            <div className="space-y-4">
              <div
                className={`p-4 rounded-lg ${
                  isDarkMode ? 'bg-slate-700/50' : 'bg-slate-50/50'
                }`}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">Chrome - Windows</h3>
                    <p className="text-sm text-slate-500">
                      Последно активен: Преди 2 минути
                    </p>
                  </div>
                  <button className="text-red-500 hover:text-red-600">
                    Прекрати
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default Settings;
