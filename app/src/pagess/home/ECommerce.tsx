import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import ThemeToggle from '../../components/ThemeToggle';
import { TestAIButton } from '../../components/TestAIButton';
import SideMenu from '../../components/SideMenu';
import Footer from '../../components/Footerr/Footer';
import TransactionForm from './components/TransactionForm';
import StatisticsCards from './components/StatisticsCards';
import TransactionCharts from './components/TransactionCharts';
import TransactionTable from './components/TransactionTable';
import { categories } from './config/categories';

interface Transaction {
  id: number;
  user_id: number;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  description: string;
  date: string;
}

const getCurrentMonths = (): { label: string; number: number }[] => {
  const months: { label: string; number: number }[] = [];
  const currentDate = new Date();
  for (let i = 5; i >= 0; i--) {
    const date = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - i,
      1,
    );
    months.push({
      label: date.toLocaleString('bg-BG', { month: 'long' }),
      number: date.getMonth(),
    });
  }
  return months;
};

const ECommerce = () => {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [chartView, setChartView] = useState<'income' | 'expense' | 'both'>(
    'both',
  );
  const [newTransaction, setNewTransaction] = useState({
    type: 'income' as const,
    amount: '',
    category: categories.income[0],
    description: '',
  });

  const currentMonths = getCurrentMonths();

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
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to load transactions');
        }

        const data = await response.json();
        setTransactions(data.transactions);
      } catch (error) {
        console.error('Error loading transactions:', error);
        alert('Грешка при зареждане на транзакциите');
      }
    };

    loadTransactions();
  }, [navigate]);

  const handleAddTransaction = async () => {
    const amount = parseFloat(newTransaction.amount);
    if (
      amount > 0 &&
      newTransaction.category &&
      newTransaction.description.trim()
    ) {
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
            amount,
            category: newTransaction.category,
            description: newTransaction.description.trim(),
            date: new Date().toISOString().split('T')[0],
          }),
        });

        const data = await response.json();

        if (response.ok) {
          setTransactions([data.transaction, ...transactions]);
          setNewTransaction({
            type: 'income',
            amount: '',
            category: categories.income[0],
            description: '',
          });
        } else {
          throw new Error(data.error || 'Грешка при добавяне на транзакция');
        }
      } catch (error: any) {
        alert(error.message || 'Възникна неочаквана грешка');
      }
    } else {
      alert('Моля попълнете всички полета!');
    }
  };

  const handleClearTransactions = async () => {
    if (
      window.confirm('Сигурни ли сте, че искате да изтриете всички транзакции?')
    ) {
      try {
        const token =
          localStorage.getItem('authToken') ||
          sessionStorage.getItem('authToken');
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await fetch('http://localhost:5000/transactions', {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          setTransactions([]);
        } else {
          throw new Error('Failed to clear transactions');
        }
      } catch (error) {
        console.error('Error clearing transactions:', error);
        alert('Грешка при изтриване на транзакциите');
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    sessionStorage.removeItem('authToken');
    navigate('/login');
  };

  const getMonthlyData = (type: 'income' | 'expense', month: number) => {
    return transactions
      .filter((t) => t.type === type && new Date(t.date).getMonth() === month)
      .reduce((sum, t) => sum + t.amount, 0);
  };

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
            <div className="flex items-center gap-4">
              <h1
                className={`text-4xl font-bold ${
                  isDarkMode ? 'text-white' : 'text-amber-950'
                }`}
              >
                Моят Бюджет
              </h1>
              <ThemeToggle />
            </div>
            <div className="flex items-center gap-4">
              <TestAIButton />
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

          <StatisticsCards
            isDarkMode={isDarkMode}
            balance={balance}
            totalIncome={totalIncome}
            totalExpense={totalExpense}
            savingsRate={savingsRate}
          />

          <TransactionForm
            isDarkMode={isDarkMode}
            newTransaction={newTransaction}
            setNewTransaction={setNewTransaction}
            handleAddTransaction={handleAddTransaction}
          />

          <TransactionCharts
            isDarkMode={isDarkMode}
            chartView={chartView}
            setChartView={setChartView}
            currentMonths={currentMonths}
            getMonthlyData={getMonthlyData}
            transactions={transactions}
          />

          <TransactionTable
            isDarkMode={isDarkMode}
            transactions={transactions}
          />
        </div>
        <div className="ml-0">
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default ECommerce;
