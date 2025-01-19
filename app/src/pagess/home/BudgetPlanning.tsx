import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import SideMenu from '../../components/SideMenu';
import Footer from '../../components/Footerr/Footer';

interface BudgetCategory {
  name: string;
  planned: number;
  actual: number;
  limit: number;
  priority: 'high' | 'medium' | 'low';
}

const BudgetPlanning = () => {
  const { isDarkMode } = useTheme();
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [expectedIncome, setExpectedIncome] = useState<number>(0);

  const [categories, setCategories] = useState<BudgetCategory[]>([
    { name: 'Храна', planned: 0, actual: 0, limit: 300, priority: 'high' },
    {
      name: 'Транспорт',
      planned: 0,
      actual: 0,
      limit: 100,
      priority: 'medium',
    },
    { name: 'Забавления', planned: 0, actual: 0, limit: 150, priority: 'low' },
    {
      name: 'Спестявания',
      planned: 0,
      actual: 0,
      limit: 200,
      priority: 'high',
    },
    { name: 'Други', planned: 0, actual: 0, limit: 100, priority: 'low' },
  ]);

  const months = [
    'Януари',
    'Февруари',
    'Март',
    'Април',
    'Май',
    'Юни',
    'Юли',
    'Август',
    'Септември',
    'Октомври',
    'Ноември',
    'Декември',
  ];

  const handleCategoryChange = (index: number, value: number) => {
    const newCategories = [...categories];
    newCategories[index].planned = value;
    setCategories(newCategories);
  };

  const totalPlanned = categories.reduce((sum, cat) => sum + cat.planned, 0);
  const remaining = expectedIncome - totalPlanned;

  return (
    <div
      className={`min-h-screen ${
        isDarkMode
          ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900'
          : 'bg-gradient-to-br from-emerald-400 via-yellow-300 to-amber-400'
      }`}
    >
      <SideMenu />
      <div className="ml-64">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-8">
            <h1
              className={`text-4xl font-bold ${
                isDarkMode ? 'text-white' : 'text-amber-950'
              }`}
            >
              Планиране на бюджет
            </h1>
          </div>

          {/* Избор на месец и очакван приход */}
          <div
            className={`mb-8 p-6 rounded-xl ${
              isDarkMode ? 'bg-gray-800/90' : 'bg-white/90'
            } shadow-xl`}
          >
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label
                  className={`block text-lg font-medium mb-2 ${
                    isDarkMode ? 'text-gray-200' : 'text-gray-700'
                  }`}
                >
                  Избери месец
                </label>
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(Number(e.target.value))}
                  className={`w-full px-4 py-3 rounded-xl border-2 ${
                    isDarkMode
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-white border-gray-200 text-gray-700'
                  }`}
                >
                  {months.map((month, index) => (
                    <option key={index} value={index}>
                      {month}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label
                  className={`block text-lg font-medium mb-2 ${
                    isDarkMode ? 'text-gray-200' : 'text-gray-700'
                  }`}
                >
                  Очакван приход
                </label>
                <input
                  type="number"
                  value={expectedIncome}
                  onChange={(e) => setExpectedIncome(Number(e.target.value))}
                  className={`w-full px-4 py-3 rounded-xl border-2 ${
                    isDarkMode
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-white border-gray-200 text-gray-700'
                  }`}
                  placeholder="0.00"
                />
              </div>
            </div>
          </div>

          {/* Разпределение по категории */}
          <div
            className={`mb-8 p-6 rounded-xl ${
              isDarkMode ? 'bg-gray-800/90' : 'bg-white/90'
            } shadow-xl`}
          >
            <h2
              className={`text-2xl font-bold mb-6 ${
                isDarkMode ? 'text-white' : 'text-gray-800'
              }`}
            >
              Разпределение по категории
            </h2>
            <div className="space-y-6">
              {categories.map((category, index) => (
                <div key={index}>
                  <div className="flex justify-between items-center mb-2">
                    <label
                      className={`text-lg font-medium ${
                        isDarkMode ? 'text-gray-200' : 'text-gray-700'
                      }`}
                    >
                      {category.name}
                    </label>
                    <span
                      className={`${
                        isDarkMode ? 'text-gray-300' : 'text-gray-600'
                      }`}
                    >
                      {category.planned} лв.
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max={expectedIncome}
                    value={category.planned}
                    onChange={(e) =>
                      handleCategoryChange(index, Number(e.target.value))
                    }
                    className="w-full"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Обобщение */}
          <div
            className={`mb-8 p-6 rounded-xl ${
              isDarkMode ? 'bg-gray-800/90' : 'bg-white/90'
            } shadow-xl`}
          >
            <h2
              className={`text-2xl font-bold mb-6 ${
                isDarkMode ? 'text-white' : 'text-gray-800'
              }`}
            >
              Обобщение
            </h2>
            <div className="grid grid-cols-3 gap-6">
              <div
                className={`p-4 rounded-lg ${
                  isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
                }`}
              >
                <h3
                  className={`text-lg font-medium mb-2 ${
                    isDarkMode ? 'text-gray-200' : 'text-gray-700'
                  }`}
                >
                  Очакван приход
                </h3>
                <p
                  className={`text-2xl font-bold ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}
                >
                  {expectedIncome} лв.
                </p>
              </div>
              <div
                className={`p-4 rounded-lg ${
                  isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
                }`}
              >
                <h3
                  className={`text-lg font-medium mb-2 ${
                    isDarkMode ? 'text-gray-200' : 'text-gray-700'
                  }`}
                >
                  Планирани разходи
                </h3>
                <p
                  className={`text-2xl font-bold ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}
                >
                  {totalPlanned} лв.
                </p>
              </div>
              <div
                className={`p-4 rounded-lg ${
                  isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
                }`}
              >
                <h3
                  className={`text-lg font-medium mb-2 ${
                    isDarkMode ? 'text-gray-200' : 'text-gray-700'
                  }`}
                >
                  Остават
                </h3>
                <p
                  className={`text-2xl font-bold ${
                    remaining >= 0 ? 'text-emerald-500' : 'text-red-500'
                  }`}
                >
                  {remaining} лв.
                </p>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default BudgetPlanning;
