import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import ThemeToggle from '../../components/ThemeToggle';
import ApexCharts from 'react-apexcharts';
import SideMenu from '../../components/SideMenu';
import Footer from '../../components/Footerr/Footer';

interface Transaction {
  id: number;
  type: 'expense';
  amount: number;
  category: string;
  description: string;
  date: string;
}

const ExpenseAnalytics = () => {
  const { isDarkMode } = useTheme();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const token =
          localStorage.getItem('authToken') ||
          sessionStorage.getItem('authToken');
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/transactions`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          },
        );

        if (!response.ok) throw new Error('Failed to fetch transactions');

        const data = await response.json();
        const expenseTransactions = data.transactions.filter(
          (t: Transaction) => t.type === 'expense',
        );
        setTransactions(expenseTransactions);
        setLoading(false);
      } catch (error) {
        console.error('Error:', error);
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  const categoryTotals = transactions.reduce(
    (acc, transaction) => {
      acc[transaction.category] =
        (acc[transaction.category] || 0) + transaction.amount;
      return acc;
    },
    {} as Record<string, number>,
  );

  const totalExpenses = Object.values(categoryTotals).reduce(
    (sum, amount) => sum + amount,
    0,
  );

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
                Анализ на разходите
              </h1>
              <ThemeToggle />
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-8 py-8 pt-20">
          {/* Обобщение на разходите */}
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
              Обобщение на разходите
            </h2>
            <p
              className={`${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}
            >
              Анализ на твоите разходни навици и модели на харчене
            </p>
          </div>

          {/* Графика на разходите */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div
              className={`p-6 rounded-xl ${
                isDarkMode ? 'bg-slate-800/50' : 'bg-white/50'
              } backdrop-blur-sm shadow-sm`}
            >
              <h2 className="text-xl font-bold mb-6">
                Разпределение по категории
              </h2>
              <ApexCharts
                options={{
                  chart: {
                    type: 'donut',
                    background: 'transparent',
                  },
                  labels: Object.keys(categoryTotals),
                  colors: [
                    '#38BDF8',
                    '#818CF8',
                    '#C084FC',
                    '#F472B6',
                    '#FB7185',
                    '#FBBF24',
                    '#34D399',
                  ],
                  legend: {
                    position: 'bottom',
                    labels: {
                      colors: isDarkMode ? '#E2E8F0' : '#334155',
                    },
                  },
                  plotOptions: {
                    pie: {
                      donut: {
                        labels: {
                          show: true,
                          total: {
                            show: true,
                            label: 'Общо разходи',
                            formatter: () => `${totalExpenses.toFixed(2)} лв.`,
                          },
                        },
                      },
                    },
                  },
                }}
                series={Object.values(categoryTotals)}
                type="donut"
                height={350}
              />
            </div>

            {/* Топ категории и анализ */}
            <div
              className={`p-6 rounded-xl ${
                isDarkMode ? 'bg-slate-800/50' : 'bg-white/50'
              } backdrop-blur-sm shadow-sm`}
            >
              <h2 className="text-xl font-bold mb-6">Топ категории разходи</h2>
              <div className="space-y-4">
                {Object.entries(categoryTotals)
                  .sort(([, a], [, b]) => b - a)
                  .map(([category, amount]) => (
                    <div
                      key={category}
                      className={`p-4 rounded-lg ${
                        isDarkMode ? 'bg-slate-700/50' : 'bg-slate-50/50'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{category}</span>
                        <div className="text-right">
                          <div className="font-bold">
                            {amount.toFixed(2)} лв.
                          </div>
                          <div className="text-sm text-slate-500">
                            {((amount / totalExpenses) * 100).toFixed(1)}%
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>

          {/* Времева линия на разходите */}
          <div
            className={`mb-8 p-6 rounded-xl ${
              isDarkMode ? 'bg-slate-800/50' : 'bg-white/50'
            } backdrop-blur-sm shadow-sm`}
          >
            <h2 className="text-xl font-bold mb-6">
              Времева линия на разходите
            </h2>
            <div className="space-y-4">
              {transactions
                .sort(
                  (a, b) =>
                    new Date(b.date).getTime() - new Date(a.date).getTime(),
                )
                .map((transaction) => (
                  <div
                    key={transaction.id}
                    className={`p-4 rounded-lg ${
                      isDarkMode ? 'bg-slate-700/50' : 'bg-slate-50/50'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-medium">
                          {transaction.category}
                        </div>
                        <div className="text-sm text-slate-500">
                          {transaction.description}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-rose-400">
                          {transaction.amount.toFixed(2)} лв.
                        </div>
                        <div className="text-sm text-slate-500">
                          {new Date(transaction.date).toLocaleDateString(
                            'bg-BG',
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default ExpenseAnalytics;
