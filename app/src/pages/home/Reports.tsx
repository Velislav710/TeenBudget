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
  FaExclamationCircle,
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
  const [isFormValid, setIsFormValid] = useState(true);
  const [dateRange, setDateRange] = useState({
    start: '',
    end: '',
  });
  const [dateError, setDateError] = useState('');
  const [maxDate, setMaxDate] = useState('');

  // Set default date range on component mount (1 year period) and set max date to today
  useEffect(() => {
    const today = new Date();
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(today.getFullYear() - 1);

    // Format today as YYYY-MM-DD for the max attribute
    const formattedToday = today.toISOString().split('T')[0];
    setMaxDate(formattedToday);

    setDateRange({
      start: oneYearAgo.toISOString().split('T')[0],
      end: formattedToday,
    });
  }, []);

  // Validate form whenever date range changes
  useEffect(() => {
    if (!dateRange.start || !dateRange.end) {
      setIsFormValid(false);
      setDateError('Моля, изберете начална и крайна дата за справката');
      return;
    }

    // Check if end date is before start date
    if (new Date(dateRange.end) < new Date(dateRange.start)) {
      setIsFormValid(false);
      setDateError('Крайната дата не може да бъде преди началната дата');
      return;
    }

    setIsFormValid(true);
    setDateError('');
  }, [dateRange]);

  // Handle date change with validation
  const handleDateChange = (field: 'start' | 'end', value: string) => {
    const newDateRange = { ...dateRange, [field]: value };
    setDateRange(newDateRange);
  };

  // Check if form is valid before proceeding with API calls
  const validateAndProceed = (callback: () => Promise<void>) => {
    if (!dateRange.start || !dateRange.end) {
      setIsFormValid(false);
      setDateError('Моля, изберете начална и крайна дата за справката');
      return;
    }

    if (new Date(dateRange.end) < new Date(dateRange.start)) {
      setIsFormValid(false);
      setDateError('Крайната дата не може да бъде преди началната дата');
      return;
    }

    callback();
  };

  // Updated generatePDF function with auth headers and validation
  const generatePDF = async () => {
    try {
      // Get the auth token from localStorage or sessionStorage
      const token =
        localStorage.getItem('authToken') ||
        sessionStorage.getItem('authToken');

      const response = await fetch(
        `${(import.meta as any).env.VITE_API_BASE_URL}/reports/pdf`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`, // Add the auth token
          },
          body: JSON.stringify({
            start: dateRange.start,
            end: dateRange.end,
          }),
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }

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

  // Updated exportToExcel function with auth headers and validation
  const exportToExcel = async () => {
    try {
      // Get the auth token from localStorage or sessionStorage
      const token =
        localStorage.getItem('authToken') ||
        sessionStorage.getItem('authToken');

      const response = await fetch(
        `${(import.meta as any).env.VITE_API_BASE_URL}/reports/excel`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`, // Add the auth token
          },
          body: JSON.stringify({
            start: dateRange.start,
            end: dateRange.end,
          }),
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }

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
            <button
              onClick={() => {
                localStorage.removeItem('authToken');
                sessionStorage.removeItem('authToken');
                window.location.href = '/login';
              }}
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

            {!isFormValid && dateError && (
              <div
                className={`mb-4 p-3 rounded-lg flex items-center gap-2 ${
                  isDarkMode
                    ? 'bg-red-900/30 text-red-200'
                    : 'bg-red-100 text-red-700'
                }`}
              >
                <FaExclamationCircle />
                <span>{dateError}</span>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${
                    !dateRange.start && !isFormValid ? 'text-red-500' : ''
                  }`}
                >
                  От дата *
                </label>
                <input
                  type="date"
                  className={`w-full p-2 rounded-lg ${
                    isDarkMode ? 'bg-slate-700 text-white' : 'bg-white'
                  } ${
                    !dateRange.start && !isFormValid
                      ? 'border-2 border-red-500'
                      : ''
                  }`}
                  value={dateRange.start}
                  onChange={(e) => handleDateChange('start', e.target.value)}
                  max={maxDate} // Prevent selecting future dates
                  required
                />
              </div>
              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${
                    (!dateRange.end ||
                      new Date(dateRange.end) < new Date(dateRange.start)) &&
                    !isFormValid
                      ? 'text-red-500'
                      : ''
                  }`}
                >
                  До дата *
                </label>
                <input
                  type="date"
                  className={`w-full p-2 rounded-lg ${
                    isDarkMode ? 'bg-slate-700 text-white' : 'bg-white'
                  } ${
                    (!dateRange.end ||
                      new Date(dateRange.end) < new Date(dateRange.start)) &&
                    !isFormValid
                      ? 'border-2 border-red-500'
                      : ''
                  }`}
                  value={dateRange.end}
                  onChange={(e) => handleDateChange('end', e.target.value)}
                  min={dateRange.start} // This prevents selecting dates before the start date
                  max={maxDate} // Prevent selecting future dates
                  required
                />
              </div>
            </div>
            <div className="flex gap-4">
              <motion.button
                whileHover={{ scale: isFormValid ? 1.05 : 1 }}
                whileTap={{ scale: isFormValid ? 0.95 : 1 }}
                onClick={() => validateAndProceed(generatePDF)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                  isDarkMode
                    ? `bg-blue-600 ${
                        isFormValid
                          ? 'hover:bg-blue-700'
                          : 'opacity-70 cursor-not-allowed'
                      }`
                    : `bg-blue-500 ${
                        isFormValid
                          ? 'hover:bg-blue-600'
                          : 'opacity-70 cursor-not-allowed'
                      }`
                } text-white`}
                disabled={!isFormValid}
              >
                <FaFilePdf />
                <span>Генерирай PDF</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: isFormValid ? 1.05 : 1 }}
                whileTap={{ scale: isFormValid ? 0.95 : 1 }}
                onClick={() => validateAndProceed(exportToExcel)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                  isDarkMode
                    ? `bg-green-600 ${
                        isFormValid
                          ? 'hover:bg-green-700'
                          : 'opacity-70 cursor-not-allowed'
                      }`
                    : `bg-green-500 ${
                        isFormValid
                          ? 'hover:bg-green-600'
                          : 'opacity-70 cursor-not-allowed'
                      }`
                } text-white`}
                disabled={!isFormValid}
              >
                <FaFileExcel />
                <span>Експорт в Excel</span>
              </motion.button>
            </div>
          </motion.div>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default Reports;
