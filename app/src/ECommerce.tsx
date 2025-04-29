import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from './context/ThemeContext';
import ThemeToggle from './components/ThemeToggle';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend
);

interface Transaction {
  id: number;
  type: TransactionType;
  amount: number;
  category: string;
  date: string;
  description: string;
  month: number;
}

type TransactionType = 'income' | 'expense';
type ChartViewType = 'income' | 'expense' | 'both';

const categories: Record<TransactionType, string[]> = {
  income: ['Джобни', 'Подарък', 'Стипендия', 'Друго'],
  expense: ['Храна', 'Транспорт', 'Забавления', 'Дрехи', 'Техника', 'Образование', 'Друго']
};

const incomeColors = [
  'rgba(34, 197, 94, 0.8)',
  'rgba(34, 197, 94, 0.6)',
  'rgba(34, 197, 94, 0.4)',
  'rgba(34, 197, 94, 0.7)'
];

const expenseColors = [
  'rgba(239, 68, 68, 0.8)',
  'rgba(239, 68, 68, 0.6)',
  'rgba(239, 68, 68, 0.7)',
  'rgba(239, 68, 68, 0.5)',
  'rgba(239, 68, 68, 0.4)',
  'rgba(239, 68, 68, 0.65)',
  'rgba(239, 68, 68, 0.75)'
];

const getCurrentMonths = () => {
  const months = [];
  const currentDate = new Date();
  for (let i = 5; i >= 0; i--) {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
    months.push({
      label: date.toLocaleString('bg-BG', { month: 'long' }),
      number: date.getMonth()
    });
  }
  return months;
};

const ECommerce = ({ setIsAuthenticated }: { setIsAuthenticated: (value: boolean) => void }) => {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [chartView, setChartView] = useState<ChartViewType>('both');
  const [newTransaction, setNewTransaction] = useState<{
    type: TransactionType;
    amount: string;
    category: string;
    description: string;
  }>({
    type: 'income',
    amount: '',
    category: categories.income[0],
    description: ''
  });

  const currentMonths = getCurrentMonths();

  const handleAddTransaction = () => {
    const amount = parseFloat(newTransaction.amount);
    if (amount > 0 && newTransaction.category) {
      const currentDate = new Date();
      setTransactions([
        {
          id: Date.now(),
          type: newTransaction.type,
          amount,
          category: newTransaction.category,
          date: currentDate.toISOString().split('T')[0],
          description: newTransaction.description,
          month: currentDate.getMonth()
        },
        ...transactions
      ]);
      setNewTransaction({
        type: 'income',
        amount: '',
        category: categories.income[0],
        description: ''
      });
    }
  };

  const handleClearTransactions = () => {
    if (window.confirm('Сигурни ли сте, че искате да изтриете всички транзакции?')) {
      setTransactions([]);
    }
  };

  const getMonthlyData = (type: TransactionType, month: number) => {
    return transactions
      .filter(t => t.type === type && t.month === month)
      .reduce((sum, t) => sum + t.amount, 0);
  };

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpense;
  const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpense) / totalIncome * 100).toFixed(1) : '0';

  const monthlyData = {
    labels: currentMonths.map(m => m.label),
    datasets: [
      {
        label: 'Приходи',
        data: currentMonths.map(m => getMonthlyData('income', m.number)),
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.5)',
        tension: 0.4
      },
      {
        label: 'Разходи',
        data: currentMonths.map(m => getMonthlyData('expense', m.number)),
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.5)',
        tension: 0.4
      }
    ]
  };

  const getCategoryData = () => {
    if (chartView === 'both') {
      return {
        labels: [...categories.income, ...categories.expense],
        datasets: [{
          data: [
            ...categories.income.map(category => 
              transactions
                .filter(t => t.type === 'income' && t.category === category)
                .reduce((sum, t) => sum + t.amount, 0)
            ),
            ...categories.expense.map(category => 
              transactions
                .filter(t => t.type === 'expense' && t.category === category)
                .reduce((sum, t) => sum + t.amount, 0)
            )
          ],
          backgroundColor: [...incomeColors, ...expenseColors]
        }]
      };
    }

    return {
      labels: categories[chartView],
      datasets: [{
        data: categories[chartView].map(category => 
          transactions
            .filter(t => t.type === chartView && t.category === category)
            .reduce((sum, t) => sum + t.amount, 0)
        ),
        backgroundColor: chartView === 'income' ? incomeColors : expenseColors
      }]
    };
  };

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: isDarkMode ? '#fff' : '#000',
          font: {
            size: 12,
            weight: 'bold' as const
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
        },
        ticks: {
          color: isDarkMode ? '#fff' : '#000',
          font: {
            weight: 'bold' as const
          }
        }
      },
      x: {
        grid: {
          color: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
        },
        ticks: {
          color: isDarkMode ? '#fff' : '#000',
          font: {
            weight: 'bold' as const
          }
        }
      }
    }
  };

  const doughnutChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: isDarkMode ? '#fff' : '#000',
          font: {
            size: 12,
            weight: 'bold' as const
          }
        }
      }
    }
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
          <div className="flex items-center gap-4">
            <button
              onClick={handleClearTransactions}
              className={`px-4 py-2 rounded-lg ${
                isDarkMode 
                  ? 'bg-gray-700 hover:bg-gray-600 text-red-400' 
                  : 'bg-white/80 hover:bg-white text-red-500'
              } transition-colors font-semibold shadow-lg`}
            >
              Изчисти историята
            </button>
            <button
              onClick={() => {
                setIsAuthenticated(false);
                navigate('/login');
              }}
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className={`p-6 rounded-xl ${
            isDarkMode ? 'bg-gray-800/90' : 'bg-white/90'
          } shadow-xl backdrop-blur-sm transform transition-all hover:scale-105`}>
            <h3 className={`text-lg font-semibold mb-2 ${
              isDarkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>Баланс</h3>
            <p className={`text-3xl font-bold ${balance >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
              {balance.toFixed(2)} лв.
            </p>
            <p className={`text-sm mt-2 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Общ баланс на бюджета
            </p>
          </div>
          
          <div className={`p-6 rounded-xl ${
            isDarkMode ? 'bg-gray-800/90' : 'bg-white/90'
          } shadow-xl backdrop-blur-sm transform transition-all hover:scale-105`}>
            <h3 className={`text-lg font-semibold mb-2 ${
              isDarkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>Приходи</h3>
            <p className="text-3xl font-bold text-emerald-500">
              {totalIncome.toFixed(2)} лв.
            </p>
            <p className={`text-sm mt-2 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Общо приходи
            </p>
          </div>
          
          <div className={`p-6 rounded-xl ${
            isDarkMode ? 'bg-gray-800/90' : 'bg-white/90'
          } shadow-xl backdrop-blur-sm transform transition-all hover:scale-105`}>
            <h3 className={`text-lg font-semibold mb-2 ${
              isDarkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>Разходи</h3>
            <p className="text-3xl font-bold text-red-500">
              {totalExpense.toFixed(2)} лв.
            </p>
            <p className={`text-sm mt-2 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Общо разходи
            </p>
          </div>
          
          <div className={`p-6 rounded-xl ${
            isDarkMode ? 'bg-gray-800/90' : 'bg-white/90'
          } shadow-xl backdrop-blur-sm transform transition-all hover:scale-105`}>
            <h3 className={`text-lg font-semibold mb-2 ${
              isDarkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>Спестявания</h3>
            <p className="text-3xl font-bold text-blue-500">
              {savingsRate}%
            </p>
            <p className={`text-sm mt-2 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Процент спестявания
            </p>
          </div>
        </div>

        <div className={`p-6 rounded-xl mb-8 ${
          isDarkMode ? 'bg-gray-800/90' : 'bg-white/90'
        } shadow-xl backdrop-blur-sm`}>
          <h2 className={`text-2xl font-bold mb-6 ${
            isDarkMode ? 'text-white' : 'text-gray-800'           }`}>Нова транзакция</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
              <select
                value={newTransaction.type}
                onChange={(e) => {
                  const type = e.target.value as TransactionType;
                  setNewTransaction({
                    ...newTransaction,
                    type,
                    category: categories[type][0]
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
                onChange={(e) => setNewTransaction({...newTransaction, category: e.target.value})}
                className={`rounded-xl p-3 ${
                  isDarkMode 
                    ? 'bg-gray-700 text-white border-gray-600' 
                    : 'bg-gray-50 border-gray-200'
                } border-2 focus:ring-2 focus:ring-emerald-500 transition-all`}
              >
                {categories[newTransaction.type].map((category: string) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              
              <input
                type="number"
                min="0"
                step="0.01"
                value={newTransaction.amount}
                onChange={(e) => setNewTransaction({...newTransaction, amount: e.target.value})}
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
                onChange={(e) => setNewTransaction({...newTransaction, description: e.target.value})}
                placeholder="Описание (незадължително)"
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
  
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div className={`p-6 rounded-xl ${
              isDarkMode ? 'bg-gray-800/90' : 'bg-white/90'
            } shadow-xl backdrop-blur-sm`}>
              <h2 className={`text-2xl font-bold mb-6 ${
                isDarkMode ? 'text-white' : 'text-gray-800'
              }`}>Месечен анализ</h2>
              <div style={{ height: '400px' }}>
                <Line data={monthlyData} options={lineChartOptions} />
              </div>
            </div>
  
            <div className={`p-6 rounded-xl ${
              isDarkMode ? 'bg-gray-800/90' : 'bg-white/90'
            } shadow-xl backdrop-blur-sm`}>
              <div className="flex justify-between items-center mb-6">
                <h2 className={`text-2xl font-bold ${
                  isDarkMode ? 'text-white' : 'text-gray-800'
                }`}>Разпределение по категории</h2>
                <select
                  value={chartView}
                  onChange={(e) => setChartView(e.target.value as ChartViewType)}
                  className={`rounded-xl p-2 ${
                    isDarkMode 
                      ? 'bg-gray-700 text-white border-gray-600' 
                      : 'bg-gray-50 border-gray-200'
                  } border-2 focus:ring-2 focus:ring-emerald-500 transition-all`}
                >
                  <option value="both">Всички</option>
                  <option value="income">Само приходи</option>
                  <option value="expense">Само разходи</option>
                </select>
              </div>
              <div style={{ height: '400px' }}>
                <Doughnut data={getCategoryData()} options={doughnutChartOptions} />
              </div>
            </div>
          </div>
  
          <div className={`p-6 rounded-xl ${
            isDarkMode ? 'bg-gray-800/90' : 'bg-white/90'
          } shadow-xl backdrop-blur-sm`}>
            <h2 className={`text-2xl font-bold mb-6 ${
              isDarkMode ? 'text-white' : 'text-gray-800'
            }`}>Последни транзакции</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className={`${
                    isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
                  }`}>
                    <th className="p-4 text-left font-bold">Дата</th>
                    <th className="p-4 text-left font-bold">Тип</th>
                    <th className="p-4 text-left font-bold">Категория</th>
                    <th className="p-4 text-left font-bold">Описание</th>
                    <th className="p-4 text-left font-bold">Сума</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map(transaction => (
                    <tr key={transaction.id} className={`border-b ${
                      isDarkMode ? 'border-gray-700' : 'border-gray-200'
                    } hover:bg-gray-50/5 transition-colors`}>
                      <td className="p-4">{transaction.date}</td>
                      <td className="p-4">{transaction.type === 'income' ? 'Приход' : 'Разход'}</td>
                      <td className="p-4">{transaction.category}</td>
                      <td className="p-4">{transaction.description}</td>
                      <td className={`p-4 font-semibold ${
                        transaction.type === 'income' ? 'text-emerald-500' : 'text-red-500'
                      }`}>
                        {transaction.type === 'income' ? '+' : '-'}{transaction.amount} лв.
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  export default ECommerce;
  
