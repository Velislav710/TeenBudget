import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import ThemeToggle from '../../components/ThemeToggle';
import SideMenu from '../../components/SideMenu';
import Footer from '../../components/Footerr/Footer';

const Reports = () => {
  const { isDarkMode } = useTheme();
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

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
                Справки и експорт
              </h1>
              <ThemeToggle />
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-8 py-8 pt-20">
          {/* Генериране на справка */}
          <div
            className={`mb-8 p-6 rounded-xl ${
              isDarkMode ? 'bg-slate-800/50' : 'bg-white/50'
            } backdrop-blur-sm shadow-sm`}
          >
            <h2
              className={`text-3xl font-bold mb-4 ${
                isDarkMode ? 'text-white' : 'text-slate-800'
              }`}
            >
              Генериране на справка
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  От дата
                </label>
                <input
                  type="date"
                  className={`w-full p-2 rounded-lg ${
                    isDarkMode ? 'bg-slate-700 text-white' : 'bg-white'
                  }`}
                  value={dateRange.start}
                  onChange={(e) =>
                    setDateRange((prev) => ({ ...prev, start: e.target.value }))
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  До дата
                </label>
                <input
                  type="date"
                  className={`w-full p-2 rounded-lg ${
                    isDarkMode ? 'bg-slate-700 text-white' : 'bg-white'
                  }`}
                  value={dateRange.end}
                  onChange={(e) =>
                    setDateRange((prev) => ({ ...prev, end: e.target.value }))
                  }
                />
              </div>
            </div>
            <div className="flex gap-4">
              <button
                className={`px-4 py-2 rounded-lg ${
                  isDarkMode
                    ? 'bg-blue-600 hover:bg-blue-700'
                    : 'bg-blue-500 hover:bg-blue-600'
                } text-white`}
              >
                Генерирай PDF
              </button>
              <button
                className={`px-4 py-2 rounded-lg ${
                  isDarkMode
                    ? 'bg-green-600 hover:bg-green-700'
                    : 'bg-green-500 hover:bg-green-600'
                } text-white`}
              >
                Експорт в Excel
              </button>
            </div>
          </div>

          {/* Списък с транзакции */}
          <div
            className={`mb-8 p-6 rounded-xl ${
              isDarkMode ? 'bg-slate-800/50' : 'bg-white/50'
            } backdrop-blur-sm shadow-sm`}
          >
            <h2 className="text-xl font-bold mb-6">Последни транзакции</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr
                    className={`text-left ${
                      isDarkMode ? 'text-slate-300' : 'text-slate-600'
                    }`}
                  >
                    <th className="pb-4">Дата</th>
                    <th className="pb-4">Категория</th>
                    <th className="pb-4">Описание</th>
                    <th className="pb-4 text-right">Сума</th>
                  </tr>
                </thead>
                <tbody className="space-y-2">
                  {/* Примерни данни */}
                  <tr
                    className={`${
                      isDarkMode ? 'text-slate-300' : 'text-slate-600'
                    }`}
                  >
                    <td className="py-2">2024-02-15</td>
                    <td>Храна</td>
                    <td>Седмични покупки</td>
                    <td className="text-right">-50.00 лв.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Споделяне */}
          <div
            className={`mb-8 p-6 rounded-xl ${
              isDarkMode ? 'bg-slate-800/50' : 'bg-white/50'
            } backdrop-blur-sm shadow-sm`}
          >
            <h2 className="text-xl font-bold mb-6">Споделяне на справка</h2>
            <div className="space-y-4">
              <div
                className={`p-4 rounded-lg ${
                  isDarkMode ? 'bg-slate-700/50' : 'bg-slate-50/50'
                }`}
              >
                <h3 className="font-medium mb-2">Изпрати по имейл</h3>
                <div className="flex gap-4">
                  <input
                    type="email"
                    placeholder="Въведи имейл адрес"
                    className={`flex-1 p-2 rounded-lg ${
                      isDarkMode ? 'bg-slate-600 text-white' : 'bg-white'
                    }`}
                  />
                  <button
                    className={`px-4 py-2 rounded-lg ${
                      isDarkMode
                        ? 'bg-blue-600 hover:bg-blue-700'
                        : 'bg-blue-500 hover:bg-blue-600'
                    } text-white`}
                  >
                    Изпрати
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

export default Reports;
