import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import ThemeToggle from '../../components/ThemeToggle';
import SideMenu from '../../components/SideMenu';
import Footer from '../../components/Footerr/Footer';
import ApexCharts from 'react-apexcharts';
import {
  FaFilePdf,
  FaFileExcel,
  FaEnvelope,
  FaChartBar,
  FaFilter,
  FaDownload,
} from 'react-icons/fa';
import { motion } from 'framer-motion';

interface Transaction {
  id: number;
  date: string;
  category: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
}

interface ReportData {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  transactions: Transaction[];
  categoryTotals: { [key: string]: number };
}

const Reports = () => {
  const { isDarkMode } = useTheme();
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [showEmailSuccess, setShowEmailSuccess] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    if (dateRange.start && dateRange.end) {
      fetchReportData();
    }
  }, [dateRange]);

  const fetchReportData = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/reports?start=${dateRange.start}&end=${dateRange.end}`,
      );
      const data = await response.json();
      setReportData(data);
    } catch (error) {
      console.error('Error fetching report data:', error);
    } finally {
      setLoading(false);
    }
  };

  const generatePDF = async () => {
    try {
      const response = await fetch('/api/reports/pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          start: dateRange.start,
          end: dateRange.end,
        }),
      });
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'financial-report.pdf';
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  const exportToExcel = async () => {
    try {
      const response = await fetch('/api/reports/excel', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          start: dateRange.start,
          end: dateRange.end,
        }),
      });
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'financial-report.xlsx';
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting to Excel:', error);
    }
  };

  const sendReportEmail = async () => {
    try {
      await fetch('/api/reports/email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          start: dateRange.start,
          end: dateRange.end,
        }),
      });
      setShowEmailSuccess(true);
      setEmail('');
      setTimeout(() => setShowEmailSuccess(false), 3000);
    } catch (error) {
      console.error('Error sending email:', error);
    }
  };

  const chartOptions = {
    chart: {
      type: 'bar' as const,
      background: 'transparent',
      toolbar: { show: false },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
        endingShape: 'rounded',
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent'],
    },
    xaxis: {
      categories: reportData ? Object.keys(reportData.categoryTotals) : [],
      labels: {
        style: {
          colors: isDarkMode ? '#E2E8F0' : '#334155',
        },
      },
    },
    yaxis: {
      labels: {
        formatter: (value: number) => `${value.toFixed(2)} лв.`,
        style: {
          colors: isDarkMode ? '#E2E8F0' : '#334155',
        },
      },
    },
    fill: {
      opacity: 1,
      colors: ['#3B82F6', '#10B981'],
    },
    tooltip: {
      y: {
        formatter: (value: number) => `${value.toFixed(2)} лв.`,
      },
    },
  };

  const chartSeries = reportData
    ? [
        {
          name: 'Разходи по категории',
          data: Object.values(reportData.categoryTotals),
        },
      ]
    : [];

  const filteredTransactions = reportData?.transactions.filter(
    (transaction) =>
      selectedCategory === 'all' || transaction.category === selectedCategory,
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
                Справки и експорт
              </h1>
              <ThemeToggle />
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-8 py-8 pt-20">
          {/* Генериране на справка */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
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
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={generatePDF}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                  isDarkMode
                    ? 'bg-blue-600 hover:bg-blue-700'
                    : 'bg-blue-500 hover:bg-blue-600'
                } text-white`}
              >
                <FaFilePdf />
                <span>Генерирай PDF</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={exportToExcel}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                  isDarkMode
                    ? 'bg-green-600 hover:bg-green-700'
                    : 'bg-green-500 hover:bg-green-600'
                } text-white`}
              >
                <FaFileExcel />
                <span>Експорт в Excel</span>
              </motion.button>
            </div>
          </motion.div>

          {/* Обобщение */}
          {reportData && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mb-8 p-6 rounded-xl ${
                isDarkMode ? 'bg-slate-800/50' : 'bg-white/50'
              } backdrop-blur-sm shadow-sm`}
            >
              <h2 className="text-xl font-bold mb-6">Обобщение</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-4 rounded-lg bg-emerald-500/10">
                  <h3 className="text-sm font-medium text-emerald-500 mb-1">
                    Общ приход
                  </h3>
                  <p className="text-2xl font-bold text-emerald-500">
                    {reportData.totalIncome.toFixed(2)} лв.
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-rose-500/10">
                  <h3 className="text-sm font-medium text-rose-500 mb-1">
                    Общ разход
                  </h3>
                  <p className="text-2xl font-bold text-rose-500">
                    {reportData.totalExpenses.toFixed(2)} лв.
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-blue-500/10">
                  <h3 className="text-sm font-medium text-blue-500 mb-1">
                    Баланс
                  </h3>
                  <p className="text-2xl font-bold text-blue-500">
                    {reportData.balance.toFixed(2)} лв.
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Графика */}
          {reportData && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mb-8 p-6 rounded-xl ${
                isDarkMode ? 'bg-slate-800/50' : 'bg-white/50'
              } backdrop-blur-sm shadow-sm`}
            >
              <h2 className="text-xl font-bold mb-6">Разходи по категории</h2>
              <ApexCharts
                options={chartOptions}
                series={chartSeries}
                type="bar"
                height={350}
              />
            </motion.div>
          )}

          {/* Списък с транзакции */}
          {reportData && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mb-8 p-6 rounded-xl ${
                isDarkMode ? 'bg-slate-800/50' : 'bg-white/50'
              } backdrop-blur-sm shadow-sm`}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Транзакции</h2>
                <div className="flex items-center gap-2">
                  <FaFilter className="text-slate-400" />
                  <select
                    className={`p-2 rounded-lg ${
                      isDarkMode ? 'bg-slate-700 text-white' : 'bg-white'
                    }`}
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  >
                    <option value="all">Всички категории</option>
                    {Object.keys(reportData.categoryTotals).map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
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
                    {filteredTransactions?.map((transaction) => (
                      <tr
                        key={transaction.id}
                        className={`${
                          isDarkMode ? 'text-slate-300' : 'text-slate-600'
                        }`}
                      >
                        <td className="py-2">{transaction.date}</td>
                        <td>{transaction.category}</td>
                        <td>{transaction.description}</td>
                        <td
                          className={`text-right ${
                            transaction.type === 'income'
                              ? 'text-emerald-500'
                              : 'text-rose-500'
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
            </motion.div>
          )}

          {/* Споделяне */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
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
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={sendReportEmail}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                      isDarkMode
                        ? 'bg-blue-600 hover:bg-blue-700'
                        : 'bg-blue-500 hover:bg-blue-600'
                    } text-white`}
                  >
                    <FaEnvelope />
                    <span>Изпрати</span>
                  </motion.button>
                </div>
                {showEmailSuccess && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-emerald-500 mt-2"
                  >
                    Справката е изпратена успешно!
                  </motion.p>
                )}
              </div>
            </div>
          </motion.div>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default Reports;
