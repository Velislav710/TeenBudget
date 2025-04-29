import React from 'react';
import { categories } from '../config/categories';

interface TransactionFormProps {
  isDarkMode: boolean;
  newTransaction: {
    type: 'income' | 'expense';
    amount: string;
    category: string;
    description: string;
  };
  setNewTransaction: (transaction: any) => void;
  handleAddTransaction: () => void;
}

const TransactionForm = ({
  isDarkMode,
  newTransaction,
  setNewTransaction,
  handleAddTransaction,
}: TransactionFormProps) => {
  return (
    <div
      className={`p-6 rounded-xl mb-8 ${
        isDarkMode ? 'bg-gray-800/90' : 'bg-white/90'
      } shadow-xl backdrop-blur-sm`}
    >
      <h2
        className={`text-2xl font-bold mb-6 ${
          isDarkMode ? 'text-white' : 'text-gray-800'
        }`}
      >
        Нова транзакция
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        <select
          value={newTransaction.type}
          onChange={(e) => {
            const type = e.target.value as 'income' | 'expense';
            setNewTransaction({
              ...newTransaction,
              type,
              category: categories[type][0],
            });
          }}
          className={`rounded-xl p-3 ${
            isDarkMode
              ? 'bg-gray-700 text-white border-gray-600'
              : 'bg-gray-50 border-gray-200'
          } border-2 focus:ring-2 focus:ring-emerald-500 transition-all`}
        >
          <option value="income">Приход</option>
          <option value="expense">Разход</option>
        </select>

        <select
          value={newTransaction.category}
          onChange={(e) =>
            setNewTransaction({
              ...newTransaction,
              category: e.target.value,
            })
          }
          className={`rounded-xl p-3 ${
            isDarkMode
              ? 'bg-gray-700 text-white border-gray-600'
              : 'bg-gray-50 border-gray-200'
          } border-2 focus:ring-2 focus:ring-emerald-500 transition-all`}
        >
          {categories[newTransaction.type].map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>

        <input
          type="number"
          min="0"
          step="0.01"
          value={newTransaction.amount}
          onChange={(e) =>
            setNewTransaction({
              ...newTransaction,
              amount: e.target.value,
            })
          }
          placeholder="Сума"
          className={`rounded-xl p-3 ${
            isDarkMode
              ? 'bg-gray-700 text-white border-gray-600'
              : 'bg-gray-50 border-gray-200'
          } border-2 focus:ring-2 focus:ring-emerald-500 transition-all`}
        />

        <input
          type="text"
          value={newTransaction.description}
          onChange={(e) =>
            setNewTransaction({
              ...newTransaction,
              description: e.target.value,
            })
          }
          placeholder="Описание (задължително)"
          className={`rounded-xl p-3 ${
            isDarkMode
              ? 'bg-gray-700 text-white border-gray-600'
              : 'bg-gray-50 border-gray-200'
          } border-2 focus:ring-2 focus:ring-emerald-500 transition-all`}
        />

        <button
          onClick={handleAddTransaction}
          className={`${
            isDarkMode
              ? 'bg-emerald-600 hover:bg-emerald-700'
              : 'bg-emerald-500 hover:bg-emerald-600'
          } text-white rounded-xl p-3 transition-all transform hover:scale-105 font-semibold shadow-lg`}
        >
          Добави
        </button>
      </div>
    </div>
  );
};

export default TransactionForm;
