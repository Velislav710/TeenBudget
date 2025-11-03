import React from 'react';

interface Transaction {
  id: number;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  date: string;
  description: string;
}

interface TransactionTableProps {
  isDarkMode: boolean;
  transactions: Transaction[];
}

const TransactionTable = ({
  isDarkMode,
  transactions,
}: TransactionTableProps) => {
  return (
    <div
      className={`p-6 rounded-xl ${
        isDarkMode ? 'bg-gray-800/90' : 'bg-white/90'
      } shadow-xl backdrop-blur-sm`}
    >
      <h2
        className={`text-2xl font-bold mb-6 ${
          isDarkMode ? 'text-white' : 'text-gray-800'
        }`}
      >
        Последни транзакции
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className={`${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <th className="p-4 text-left font-bold">Дата</th>
              <th className="p-4 text-left font-bold">Тип</th>
              <th className="p-4 text-left font-bold">Категория</th>
              <th className="p-4 text-left font-bold">Описание</th>
              <th className="p-4 text-left font-bold">Сума</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => (
              <tr
                key={transaction.id}
                className={`border-b ${
                  isDarkMode ? 'border-gray-700' : 'border-gray-200'
                } hover:bg-gray-50/5 transition-colors`}
              >
                <td className="p-4">{transaction.date}</td>
                <td className="p-4">
                  {transaction.type === 'income' ? 'Приход' : 'Разход'}
                </td>
                <td className="p-4">{transaction.category}</td>
                <td className="p-4">{transaction.description}</td>
                <td
                  className={`p-4 font-semibold ${
                    transaction.type === 'income'
                      ? 'text-emerald-500'
                      : 'text-red-500'
                  }`}
                >
                  {transaction.type === 'income' ? '+' : '-'}
                  {transaction.amount.toFixed(2)} лв.
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionTable;
