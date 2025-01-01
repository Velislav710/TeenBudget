import React from 'react';

interface StatisticsCardsProps {
  isDarkMode: boolean;
  balance: number;
  totalIncome: number;
  totalExpense: number;
  savingsRate: string;
}

const StatisticsCards = ({
  isDarkMode,
  balance,
  totalIncome,
  totalExpense,
  savingsRate,
}: StatisticsCardsProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div
        className={`p-6 rounded-xl ${
          isDarkMode ? 'bg-gray-800/90' : 'bg-white/90'
        } shadow-xl backdrop-blur-sm transform transition-all hover:scale-105`}
      >
        <h3
          className={`text-lg font-semibold mb-2 ${
            isDarkMode ? 'text-gray-300' : 'text-gray-700'
          }`}
        >
          Баланс
        </h3>
        <p
          className={`text-3xl font-bold ${
            balance >= 0 ? 'text-emerald-500' : 'text-red-500'
          }`}
        >
          {balance.toFixed(2)} лв.
        </p>
        <p
          className={`text-sm mt-2 ${
            isDarkMode ? 'text-gray-400' : 'text-gray-600'
          }`}
        >
          Общ баланс на бюджета
        </p>
      </div>

      <div
        className={`p-6 rounded-xl ${
          isDarkMode ? 'bg-gray-800/90' : 'bg-white/90'
        } shadow-xl backdrop-blur-sm transform transition-all hover:scale-105`}
      >
        <h3
          className={`text-lg font-semibold mb-2 ${
            isDarkMode ? 'text-gray-300' : 'text-gray-700'
          }`}
        >
          Приходи
        </h3>
        <p className="text-3xl font-bold text-emerald-500">
          {totalIncome.toFixed(2) || 'N/A'} лв.
        </p>
        <p
          className={`text-sm mt-2 ${
            isDarkMode ? 'text-gray-400' : 'text-gray-600'
          }`}
        >
          Общо приходи
        </p>
      </div>

      <div
        className={`p-6 rounded-xl ${
          isDarkMode ? 'bg-gray-800/90' : 'bg-white/90'
        } shadow-xl backdrop-blur-sm transform transition-all hover:scale-105`}
      >
        <h3
          className={`text-lg font-semibold mb-2 ${
            isDarkMode ? 'text-gray-300' : 'text-gray-700'
          }`}
        >
          Разходи
        </h3>
        <p className="text-3xl font-bold text-red-500">
          {totalExpense.toFixed(2) || 'N/A'} лв.
        </p>
        <p
          className={`text-sm mt-2 ${
            isDarkMode ? 'text-gray-400' : 'text-gray-600'
          }`}
        >
          Общо разходи
        </p>
      </div>

      <div
        className={`p-6 rounded-xl ${
          isDarkMode ? 'bg-gray-800/90' : 'bg-white/90'
        } shadow-xl backdrop-blur-sm transform transition-all hover:scale-105`}
      >
        <h3
          className={`text-lg font-semibold mb-2 ${
            isDarkMode ? 'text-gray-300' : 'text-gray-700'
          }`}
        >
          Спестявания
        </h3>
        <p className="text-3xl font-bold text-blue-500">{savingsRate}%</p>
        <p
          className={`text-sm mt-2 ${
            isDarkMode ? 'text-gray-400' : 'text-gray-600'
          }`}
        >
          Процент спестявания
        </p>
      </div>
    </div>
  );
};

export default StatisticsCards;
