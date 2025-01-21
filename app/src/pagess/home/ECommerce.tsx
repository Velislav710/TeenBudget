import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import ThemeToggle from '../../components/ThemeToggle';
import ApexCharts from 'react-apexcharts';
import SideMenu from '../../components/SideMenu';
import Footer from '../../components/Footerr/Footer';
import { fetchOpenAIResponse } from './helper-functions';

const categories = {
  income: ['Джобни', 'Подарък', 'Стипендия', 'Работа', 'Спестявания', 'Други'],
  expense: [
    'Храна',
    'Транспорт',
    'Развлечения',
    'Спорт и здраве',
    'Образование',
    'Дрехи',
    'Битови разходи',
    'Други',
  ],
};

interface Transaction {
  id: number;
  user_id: number;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  description: string;
  date: string;
}

interface FormErrors {
  amount: string;
  category: string;
  description: string;
}

const ECommerce = () => {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [chartType, setChartType] = useState<'income' | 'expense'>('expense');
  const [formErrors, setFormErrors] = useState<FormErrors>({
    amount: '',
    category: '',
    description: '',
  });

  const [newTransaction, setNewTransaction] = useState({
    type: 'income' as const,
    amount: '',
    category: categories.income[0],
    description: '',
  });

  // Функция за форматиране на дата
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('bg-BG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Зареждане на транзакции
  useEffect(() => {
    const loadTransactions = async () => {
      try {
        const token =
          localStorage.getItem('authToken') ||
          sessionStorage.getItem('authToken');
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await fetch('http://localhost:5000/transactions', {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok)
          throw new Error('Грешка при зареждане на транзакциите');

        const data = await response.json();
        setTransactions(data.transactions);
      } catch (error) {
        console.error('Error:', error);
      }
    };

    loadTransactions();
  }, [navigate]);

  // Изчисляване на финансови показатели
  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpense;
  const savingsRate =
    totalIncome > 0
      ? (((totalIncome - totalExpense) / totalIncome) * 100).toFixed(1)
      : '0';

  // Валидация на форма
  const validateForm = () => {
    const errors: FormErrors = {
      amount: '',
      category: '',
      description: '',
    };

    if (!newTransaction.amount) {
      errors.amount = 'Моля, въведете сума';
    } else if (parseFloat(newTransaction.amount) <= 0) {
      errors.amount = 'Сумата трябва да бъде положително число';
    }

    if (!newTransaction.category) {
      errors.category = 'Моля, изберете категория';
    }

    if (!newTransaction.description.trim()) {
      errors.description = 'Моля, добавете описание';
    }

    setFormErrors(errors);
    return !Object.values(errors).some((error) => error !== '');
  };

  // Добавяне на транзакция
  const handleAddTransaction = async () => {
    if (!validateForm()) return;

    try {
      const token =
        localStorage.getItem('authToken') ||
        sessionStorage.getItem('authToken');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await fetch('http://localhost:5000/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          type: newTransaction.type,
          amount: parseFloat(newTransaction.amount),
          category: newTransaction.category,
          description: newTransaction.description.trim(),
          date: new Date().toISOString().split('T')[0],
        }),
      });

      if (!response.ok) throw new Error('Грешка при добавяне на транзакция');

      const data = await response.json();
      setTransactions([data.transaction, ...transactions]);
      setNewTransaction({
        type: 'income',
        amount: '',
        category: categories.income[0],
        description: '',
      });
      setFormErrors({ amount: '', category: '', description: '' });
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // Изход от профила
  const handleLogout = () => {
    localStorage.removeItem('authToken');
    sessionStorage.removeItem('authToken');
    navigate('/login');
  };

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
        <div className="max-w-7xl mx-auto">
          {/* Хедър */}
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
                  Финансово табло
                </h1>
                <ThemeToggle />
              </div>

              <button
                onClick={handleLogout}
                className={`px-6 py-2 rounded-md ${
                  isDarkMode
                    ? 'bg-rose-500/90 hover:bg-rose-600/90'
                    : 'bg-rose-400/90 hover:bg-rose-500/90'
                } text-white transition-all duration-200`}
                title="Изход от профила"
              >
                Изход
              </button>
            </div>
            <div className="mb-8">
              <button
                onClick={async () => {
                  const analysisData = {
                    totalIncome,
                    totalExpense,
                    totalBalance: balance,
                    savingsRate,
                    transactions: transactions.slice(0, 10),
                  };

                  const aiResponse = await fetchOpenAIResponse(analysisData);
                  if (aiResponse) {
                    alert(JSON.stringify(aiResponse.analysis, null, 2));
                  }
                }}
                className={`px-6 py-2 rounded-md ${
                  isDarkMode
                    ? 'bg-violet-500/90 hover:bg-violet-600/90'
                    : 'bg-violet-400/90 hover:bg-violet-500/90'
                } text-white transition-all duration-200`}
              >
                Анализирай с AI
              </button>
            </div>
          </header>

          {/* Основно съдържание */}
          <main className="pt-20 px-8 pb-8">
            {/* Информативно съобщение */}
            <div
              className={`mb-8 p-4 rounded-lg ${
                isDarkMode ? 'bg-slate-800/50' : 'bg-white/50'
              } backdrop-blur-sm shadow-sm`}
            >
              <p className={isDarkMode ? 'text-slate-300' : 'text-slate-600'}>
                Добре дошли във вашето финансово табло! Тук можете да следите
                всички ваши приходи и разходи, да анализирате финансовите си
                навици и да планирате бюджета си по-ефективно.
              </p>
            </div>

            {/* Финансови показатели */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div
                className={`p-6 rounded-lg ${
                  isDarkMode ? 'bg-slate-800/50' : 'bg-white/50'
                } backdrop-blur-sm shadow-sm transition-all duration-200`}
              >
                <h3 className="text-lg font-semibold mb-2">Текущ баланс</h3>
                <p
                  className={`text-2xl font-bold ${
                    balance >= 0 ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                >
                  {balance.toFixed(2)} лв.
                </p>
              </div>

              <div
                className={`p-6 rounded-lg ${
                  isDarkMode ? 'bg-slate-800/50' : 'bg-white/50'
                } backdrop-blur-sm shadow-sm transition-all duration-200`}
              >
                <h3 className="text-lg font-semibold mb-2">Общо приходи</h3>
                <p className="text-2xl font-bold text-emerald-400">
                  {totalIncome.toFixed(2)} лв.
                </p>
              </div>

              <div
                className={`p-6 rounded-lg ${
                  isDarkMode ? 'bg-slate-800/50' : 'bg-white/50'
                } backdrop-blur-sm shadow-sm transition-all duration-200`}
              >
                <h3 className="text-lg font-semibold mb-2">Общо разходи</h3>
                <p className="text-2xl font-bold text-rose-400">
                  {totalExpense.toFixed(2)} лв.
                </p>
              </div>

              <div
                className={`p-6 rounded-lg ${
                  isDarkMode ? 'bg-slate-800/50' : 'bg-white/50'
                } backdrop-blur-sm shadow-sm transition-all duration-200`}
              >
                <h3 className="text-lg font-semibold mb-2">
                  Процент спестявания
                </h3>
                <p className="text-2xl font-bold text-sky-400">
                  {savingsRate}%
                </p>
              </div>
            </div>

            {/* Форма за добавяне на транзакция */}
            <div
              className={`p-6 rounded-lg ${
                isDarkMode ? 'bg-slate-800/50' : 'bg-white/50'
              } backdrop-blur-sm shadow-sm mb-8`}
            >
              <h2 className="text-xl font-bold mb-4">
                Добавяне на нова транзакция
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <select
                    value={newTransaction.type}
                    onChange={(e) =>
                      setNewTransaction({
                        ...newTransaction,
                        type: e.target.value as 'income' | 'expense',
                        category:
                          e.target.value === 'income'
                            ? categories.income[0]
                            : categories.expense[0],
                      })
                    }
                    className={`w-full p-2 rounded-md ${
                      isDarkMode
                        ? 'bg-slate-700 text-white'
                        : 'bg-white text-slate-900'
                    } border border-slate-300 focus:ring-2 focus:ring-sky-300`}
                  >
                    <option value="income">Приход</option>
                    <option value="expense">Разход</option>
                  </select>
                </div>

                <div>
                  <input
                    type="number"
                    value={newTransaction.amount}
                    onChange={(e) =>
                      setNewTransaction({
                        ...newTransaction,
                        amount: e.target.value,
                      })
                    }
                    placeholder="Сума"
                    className={`w-full p-2 rounded-md ${
                      isDarkMode
                        ? 'bg-slate-700 text-white'
                        : 'bg-white text-slate-900'
                    } border ${
                      formErrors.amount ? 'border-rose-400' : 'border-slate-300'
                    } focus:ring-2 focus:ring-sky-300`}
                  />
                  {formErrors.amount && (
                    <p className="text-rose-400 text-sm mt-1">
                      {formErrors.amount}
                    </p>
                  )}
                </div>

                <div>
                  <select
                    value={newTransaction.category}
                    onChange={(e) =>
                      setNewTransaction({
                        ...newTransaction,
                        category: e.target.value,
                      })
                    }
                    className={`w-full p-2 rounded-md ${
                      isDarkMode
                        ? 'bg-slate-700 text-white'
                        : 'bg-white text-slate-900'
                    } border ${
                      formErrors.category
                        ? 'border-rose-400'
                        : 'border-slate-300'
                    } focus:ring-2 focus:ring-sky-300`}
                  >
                    {(newTransaction.type === 'income'
                      ? categories.income
                      : categories.expense
                    ).map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                  {formErrors.category && (
                    <p className="text-rose-400 text-sm mt-1">
                      {formErrors.category}
                    </p>
                  )}
                </div>

                <div>
                  <input
                    type="text"
                    value={newTransaction.description}
                    onChange={(e) =>
                      setNewTransaction({
                        ...newTransaction,
                        description: e.target.value,
                      })
                    }
                    placeholder="Описание"
                    className={`w-full p-2 rounded-md ${
                      isDarkMode
                        ? 'bg-slate-700 text-white'
                        : 'bg-white text-slate-900'
                    } border ${
                      formErrors.description
                        ? 'border-rose-400'
                        : 'border-slate-300'
                    } focus:ring-2 focus:ring-sky-300`}
                  />
                  {formErrors.description && (
                    <p className="text-rose-400 text-sm mt-1">
                      {formErrors.description}
                    </p>
                  )}
                </div>
              </div>

              <button
                onClick={handleAddTransaction}
                className={`mt-4 px-6 py-2 rounded-md ${
                  isDarkMode
                    ? 'bg-sky-500/90 hover:bg-sky-600/90'
                    : 'bg-sky-400/90 hover:bg-sky-500/90'
                } text-white transition-all duration-200`}
              >
                Добави транзакция
              </button>
            </div>

            {/* Диаграми */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <div
                className={`p-6 rounded-lg ${
                  isDarkMode ? 'bg-slate-800/50' : 'bg-white/50'
                } backdrop-blur-sm shadow-sm`}
              >
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold">
                    Разпределение по категория
                  </h2>
                  <select
                    value={chartType}
                    onChange={(e) =>
                      setChartType(e.target.value as 'income' | 'expense')
                    }
                    className={`p-2 rounded-md ${
                      isDarkMode
                        ? 'bg-slate-700 text-white'
                        : 'bg-white text-slate-900'
                    } border border-slate-300`}
                  >
                    <option value="income">Приходи</option>
                    <option value="expense">Разходи</option>
                  </select>
                </div>

                <ApexCharts
                  options={{
                    chart: {
                      type: 'pie',
                      background: 'transparent',
                    },
                    labels: transactions
                      .filter((t) => t.type === chartType)
                      .reduce((acc: string[], curr) => {
                        if (!acc.includes(curr.category))
                          acc.push(curr.category);
                        return acc;
                      }, []),
                    colors:
                      chartType === 'expense'
                        ? [
                            '#FDA4AF',
                            '#FB7185',
                            '#F43F5E',
                            '#E11D48',
                            '#BE123C',
                            '#9F1239',
                            '#881337',
                            '#770C2D',
                          ]
                        : [
                            '#6EE7B7',
                            '#34D399',
                            '#10B981',
                            '#059669',
                            '#047857',
                            '#065F46',
                            '#064E3B',
                            '#053F2F',
                          ],
                    legend: {
                      position: 'bottom',
                      labels: {
                        colors: isDarkMode ? '#E2E8F0' : '#334155',
                      },
                    },
                    responsive: [
                      {
                        breakpoint: 480,
                        options: {
                          chart: {
                            width: 300,
                          },
                          legend: {
                            position: 'bottom',
                          },
                        },
                      },
                    ],
                  }}
                  series={transactions
                    .filter((t) => t.type === chartType)
                    .reduce((acc: number[], curr) => {
                      const index = acc.findIndex((t) => t === curr.amount);
                      if (index === -1) acc.push(curr.amount);
                      else acc[index] += curr.amount;
                      return acc;
                    }, [])}
                  type="pie"
                  height={350}
                />
              </div>

              <div
                className={`p-6 rounded-lg ${
                  isDarkMode ? 'bg-slate-800/50' : 'bg-white/50'
                } backdrop-blur-sm shadow-sm`}
              >
                <h2 className="text-xl font-bold mb-4">Тенденции</h2>
                <ApexCharts
                  options={{
                    chart: {
                      type: 'line',
                      background: 'transparent',
                    },
                    stroke: {
                      curve: 'smooth',
                      width: 3,
                    },
                    colors: ['#34D399', '#FB7185'],
                    xaxis: {
                      categories: transactions
                        .slice(-6)
                        .map((t) => formatDate(t.date)),
                      labels: {
                        style: {
                          colors: isDarkMode ? '#E2E8F0' : '#334155',
                        },
                      },
                    },
                    yaxis: {
                      labels: {
                        style: {
                          colors: isDarkMode ? '#E2E8F0' : '#334155',
                        },
                      },
                    },
                    legend: {
                      labels: {
                        colors: isDarkMode ? '#E2E8F0' : '#334155',
                      },
                    },
                  }}
                  series={[
                    {
                      name: 'Приходи',
                      data: transactions
                        .filter((t) => t.type === 'income')
                        .slice(-6)
                        .map((t) => t.amount),
                    },
                    {
                      name: 'Разходи',
                      data: transactions
                        .filter((t) => t.type === 'expense')
                        .slice(-6)
                        .map((t) => t.amount),
                    },
                  ]}
                  height={350}
                />
              </div>
            </div>

            {/* Таблица с последните транзакции */}
            <div
              className={`p-6 rounded-lg ${
                isDarkMode ? 'bg-slate-800/50' : 'bg-white/50'
              } backdrop-blur-sm shadow-sm`}
            >
              <h2 className="text-xl font-bold mb-4">Последни транзакции</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr
                      className={
                        isDarkMode ? 'bg-slate-700/50' : 'bg-slate-50/50'
                      }
                    >
                      <th className="p-3 text-left">Дата</th>
                      <th className="p-3 text-left">Тип</th>
                      <th className="p-3 text-left">Категория</th>
                      <th className="p-3 text-left">Описание</th>
                      <th className="p-3 text-right">Сума</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.slice(0, 5).map((transaction) => (
                      <tr
                        key={transaction.id}
                        className={`border-b ${
                          isDarkMode ? 'border-slate-700' : 'border-slate-200'
                        }`}
                      >
                        <td className="p-3">{formatDate(transaction.date)}</td>
                        <td className="p-3">
                          {transaction.type === 'income' ? 'Приход' : 'Разход'}
                        </td>
                        <td className="p-3">{transaction.category}</td>
                        <td className="p-3">{transaction.description}</td>
                        <td
                          className={`p-3 text-right ${
                            transaction.type === 'income'
                              ? 'text-emerald-400'
                              : 'text-rose-400'
                          }`}
                        >
                          {transaction.amount.toFixed(2)} лв.
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </main>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default ECommerce;
