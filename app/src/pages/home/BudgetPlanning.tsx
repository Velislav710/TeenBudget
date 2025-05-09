import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import ThemeToggle from '../../components/ThemeToggle';
import ApexCharts from 'react-apexcharts';
import SideMenu from '../../components/SideMenu';
import Footer from '../../components/Footerr/Footer';
import {
  fetchFinancialAnalysisAI,
  saveFinancialAnalysis,
} from './helper-functions';

interface BudgetCategory {
  name: string;
  planned: number;
  aiSuggested: number;
  previousAverage: number;
  icon: string;
}

const BudgetPlanning = () => {
  const { isDarkMode } = useTheme();
  const [expectedIncome, setExpectedIncome] = useState<string>('');
  const [confirmedIncome, setConfirmedIncome] = useState<number>(0);
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [categories, setCategories] = useState<BudgetCategory[]>([
    {
      name: 'Храна',
      planned: 0,
      aiSuggested: 0,
      previousAverage: 0,
      icon: '🍽️',
    },
    {
      name: 'Транспорт',
      planned: 0,
      aiSuggested: 0,
      previousAverage: 0,
      icon: '🚌',
    },
    {
      name: 'Развлечения',
      planned: 0,
      aiSuggested: 0,
      previousAverage: 0,
      icon: '🎮',
    },
    {
      name: 'Спорт и здраве',
      planned: 0,
      aiSuggested: 0,
      previousAverage: 0,
      icon: '⚽',
    },
    {
      name: 'Образование',
      planned: 0,
      aiSuggested: 0,
      previousAverage: 0,
      icon: '📚',
    },
    {
      name: 'Дрехи',
      planned: 0,
      aiSuggested: 0,
      previousAverage: 0,
      icon: '👕',
    },
    {
      name: 'Други',
      planned: 0,
      aiSuggested: 0,
      previousAverage: 0,
      icon: '📦',
    },
  ]);

  const nextMonth = new Date();
  nextMonth.setMonth(nextMonth.getMonth() + 1);
  const nextMonthName = nextMonth.toLocaleDateString('bg-BG', {
    month: 'long',
  });

  useEffect(() => {
    const loadPreviousTransactions = async () => {
      try {
        const token =
          localStorage.getItem('authToken') ||
          sessionStorage.getItem('authToken');
        const response = await fetch(
          `${(import.meta as any).env.VITE_API_BASE_URL}/transactions`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          },
        );

        if (!response.ok) throw new Error('Грешка при зареждане на транзакции');

        const data = await response.json();

        const averages = data.transactions.reduce((acc: any, t: any) => {
          if (t.type === 'expense') {
            acc[t.category] = (acc[t.category] || 0) + t.amount;
          }
          return acc;
        }, {});

        const updatedCategories = categories.map((cat) => ({
          ...cat,
          previousAverage: averages[cat.name] || 0,
        }));

        setCategories(updatedCategories);
      } catch (error) {
        console.error('Error loading transactions:', error);
      }
    };

    loadPreviousTransactions();
  }, []);

  const handleIncomeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || Number(value) >= 0) {
      setExpectedIncome(value);
    }
  };

  const handleConfirmIncome = async () => {
    const income = Number(expectedIncome);
    if (income > 0) {
      setConfirmedIncome(income);
      setIsLoading(true);

      try {
        const aiResult = await fetchFinancialAnalysisAI({
          expectedIncome: income,
          previousCategories: categories.reduce(
            (acc, cat) => {
              acc[cat.name] = cat.previousAverage;
              return acc;
            },
            {} as Record<string, number>,
          ),
        });

        if (aiResult && aiResult.suggestions) {
          const newCategories = categories.map((cat) => ({
            ...cat,
            planned: aiResult.suggestions[cat.name] || 0,
            aiSuggested: aiResult.suggestions[cat.name] || 0,
          }));

          console.log('aiResult: ', aiResult);
          saveFinancialAnalysis(aiResult as any);
          setCategories(newCategories);
          setAiAnalysis(aiResult.analysis);
        }
      } catch (error) {
        console.error('Error in handleConfirmIncome:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleCategoryChange = (index: number, value: number) => {
    if (confirmedIncome > 0) {
      const newCategories = [...categories];
      newCategories[index].planned = value;
      setCategories(newCategories);
    }
  };

  const totalPlanned = categories.reduce((sum, cat) => sum + cat.planned, 0);
  const remaining = confirmedIncome - totalPlanned;

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
                Планиране на бюджет
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
              Планиране на бюджет за {nextMonthName}
            </h2>
            <p
              className={`${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}
            >
              Планирай разумно своите разходи за следващия месец. Въведи
              очаквания си доход и получи персонализирани AI препоръки за
              оптимално разпределение на средствата по категории.
            </p>
          </div>

          <div
            className={`mb-8 p-6 rounded-xl ${
              isDarkMode ? 'bg-slate-800/50' : 'bg-white/50'
            } backdrop-blur-sm shadow-sm`}
          >
            <h2 className="text-xl font-bold mb-4">Очакван доход</h2>
            <div className="flex gap-4 items-end">
              <div className="flex-1">
                <input
                  type="number"
                  value={expectedIncome}
                  onChange={handleIncomeChange}
                  min="0"
                  className={`w-full p-3 rounded-lg ${
                    isDarkMode
                      ? 'bg-slate-700 text-white'
                      : 'bg-white text-slate-900'
                  } border border-slate-300 focus:ring-2 focus:ring-sky-300`}
                  placeholder="Въведи очакван доход"
                />
              </div>
              <button
                onClick={handleConfirmIncome}
                disabled={isLoading}
                className={`px-6 py-3 rounded-lg ${
                  isDarkMode
                    ? 'bg-sky-500 hover:bg-sky-600'
                    : 'bg-sky-400 hover:bg-sky-500'
                } text-white transition-all duration-200 flex items-center gap-2 ${
                  isLoading ? 'opacity-75 cursor-not-allowed' : ''
                }`}
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Генериране...</span>
                  </>
                ) : (
                  'Потвърди и получи AI препоръки'
                )}
              </button>
            </div>
          </div>

          {confirmedIncome > 0 && (
            <>
              <div
                className={`mb-8 p-6 rounded-xl ${
                  isDarkMode ? 'bg-slate-800/50' : 'bg-white/50'
                } backdrop-blur-sm shadow-sm`}
              >
                <h2 className="text-xl font-bold mb-6">
                  Разпределение по категории
                </h2>
                <div className="grid gap-6">
                  {categories.map((category, index) => (
                    <div
                      key={category.name}
                      className={`p-4 rounded-lg ${
                        isDarkMode ? 'bg-slate-700/50' : 'bg-slate-50/50'
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-xl">{category.icon}</span>
                        <h3 className="text-lg font-medium">{category.name}</h3>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                        <div>
                          <label className="text-sm text-slate-500">
                            AI Предложение
                          </label>
                          <p className="text-lg font-semibold text-violet-400">
                            {category.aiSuggested.toFixed(2)} лв.
                            <span className="text-sm ml-1">
                              (
                              {(
                                (category.aiSuggested / confirmedIncome) *
                                100
                              ).toFixed(1)}
                              %)
                            </span>
                          </p>
                        </div>

                        <div className="col-span-2 space-y-2">
                          <div className="flex gap-4">
                            <input
                              type="range"
                              min="0"
                              max={confirmedIncome}
                              value={category.planned}
                              onChange={(e) =>
                                handleCategoryChange(
                                  index,
                                  Number(e.target.value),
                                )
                              }
                              className="w-full"
                            />
                            <input
                              type="number"
                              min="0"
                              max={confirmedIncome}
                              step="0.01"
                              value={category.planned}
                              onChange={(e) =>
                                handleCategoryChange(
                                  index,
                                  Number(e.target.value),
                                )
                              }
                              className={`w-24 p-1 rounded-md text-right ${
                                isDarkMode
                                  ? 'bg-slate-600 text-white'
                                  : 'bg-white text-slate-900'
                              } border border-slate-300 focus:ring-2 focus:ring-sky-300`}
                            />
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>{category.planned.toFixed(2)} лв.</span>
                            <span
                              className={
                                category.planned > category.aiSuggested
                                  ? 'text-rose-400'
                                  : 'text-emerald-400'
                              }
                            >
                              {(
                                (category.planned / confirmedIncome) *
                                100
                              ).toFixed(1)}
                              %
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <div
                  className={`p-6 rounded-xl ${
                    isDarkMode ? 'bg-slate-800/50' : 'bg-white/50'
                  } backdrop-blur-sm shadow-sm`}
                >
                  <h2 className="text-xl font-bold mb-6">Обобщение</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div
                      className={`p-4 rounded-lg ${
                        isDarkMode ? 'bg-slate-700/50' : 'bg-slate-50/50'
                      }`}
                    >
                      <h3 className="text-sm text-slate-500 mb-1">
                        Планирани разходи
                      </h3>
                      <p className="text-2xl font-bold text-rose-400">
                        {totalPlanned.toFixed(2)} лв.
                      </p>
                    </div>

                    <div
                      className={`p-4 rounded-lg ${
                        isDarkMode ? 'bg-slate-700/50' : 'bg-slate-50/50'
                      }`}
                    >
                      <h3 className="text-sm text-slate-500 mb-1">Остават</h3>
                      <p
                        className={`text-2xl font-bold ${
                          remaining >= 0 ? 'text-emerald-400' : 'text-rose-400'
                        }`}
                      >
                        {remaining.toFixed(2)} лв.
                      </p>
                    </div>
                  </div>

                  {aiAnalysis && (
                    <div
                      className={`mt-6 p-4 rounded-lg ${
                        isDarkMode ? 'bg-slate-700/50' : 'bg-slate-50/50'
                      }`}
                    >
                      <h3 className="font-medium mb-2">AI Препоръки</h3>
                      <ul className="space-y-2">
                        {aiAnalysis.recommendations.map(
                          (rec: string, index: number) => (
                            <li key={index} className="flex items-start gap-2">
                              <span className="text-sky-400">•</span>
                              <span className="text-sm">{rec}</span>
                            </li>
                          ),
                        )}
                      </ul>
                    </div>
                  )}
                </div>

                <div
                  className={`p-6 rounded-xl ${
                    isDarkMode ? 'bg-slate-800/50' : 'bg-white/50'
                  } backdrop-blur-sm shadow-sm`}
                >
                  <h2 className="text-xl font-bold mb-6">
                    Визуализация на бюджета
                  </h2>
                  <ApexCharts
                    options={{
                      chart: {
                        type: 'donut',
                        background: 'transparent',
                      },
                      labels: categories.map((c) => c.name),
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
                                label: 'Общо',
                                formatter: () =>
                                  `${totalPlanned.toFixed(2)} лв.`,
                              },
                            },
                          },
                        },
                      },
                    }}
                    series={categories.map((c) => c.planned)}
                    type="donut"
                    height={350}
                  />
                </div>
              </div>
            </>
          )}
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default BudgetPlanning;
