import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import ThemeToggle from '../../components/ThemeToggle';
import ApexCharts from 'react-apexcharts';
import SideMenu from '../../components/SideMenu';
import Footer from '../../components/Footerr/Footer';
import { fetchExpenseAnalytics } from './helper-functions';

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
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPeriod, setSelectedPeriod] = useState<number>(30);
  const [isGeneratingAnalysis, setIsGeneratingAnalysis] = useState(false);
  const [timelineData, setTimelineData] = useState<any>([]);
  const [categoryTrends, setCategoryTrends] = useState<any>([]);

  const generateAnalysis = async () => {
    setIsGeneratingAnalysis(true);
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

      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - selectedPeriod); // Ясно преобразуване в число

      const filteredTransactions = expenseTransactions.filter(
        (t: Transaction) => {
          const transactionDate = new Date(t.date); // Уверяваме се, че е Date обект
          return (
            !isNaN(transactionDate.getTime()) &&
            transactionDate >= thirtyDaysAgo
          );
        },
      );

      console.log('filteredTransactions: ', filteredTransactions);
      setTransactions(filteredTransactions);

      const totalSpent = filteredTransactions.reduce(
        (sum, t) => sum + t.amount,
        0,
      );
      const totalBalance = data.transactions.reduce(
        (sum, t) => sum + (t.type === 'income' ? t.amount : -t.amount),
        0,
      );
      const totalIncome = data.transactions
        .filter((t: { type: string }) => t.type === 'income')
        .reduce((sum: number, t: Transaction) => sum + t.amount, 0);

      const analysisData = {
        transactions: filteredTransactions,
        period: selectedPeriod + ' days',
        totalSpent,
        totalBalance,
        totalIncome,
        categorySummary: getCategorySummary(filteredTransactions),
        spendingPatterns: analyzeSpendingPatterns(filteredTransactions),
        trends: analyzeTrends(filteredTransactions),
      };

      console.log('analysisData: ', analysisData);
      const aiResult = await fetchExpenseAnalytics(analysisData);
      console.log('aiResult: ', aiResult);

      setAiAnalysis(aiResult);

      // Добавяме изпращане към базата данни
      await fetch(`${import.meta.env.VITE_API_BASE_URL}/expense_analysis`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          total_income: analysisData.totalIncome,
          total_expense: analysisData.totalSpent,
          total_balance: analysisData.totalBalance,
          savings_rate:
            ((analysisData.totalIncome - analysisData.totalSpent) /
              analysisData.totalIncome) *
            100,
          main_findings: aiResult.analysis.overallSummary.mainFindings,
          key_insights: JSON.stringify(
            aiResult.analysis.overallSummary.keyInsights,
          ),
          risk_areas: JSON.stringify(
            aiResult.analysis.overallSummary.riskAreas,
          ),
          date: new Date(),
        }),
      });

      prepareVisualizationData(filteredTransactions);
      setIsGeneratingAnalysis(false);
      setLoading(false);
    } catch (error) {
      console.error('Error:', error);
      setIsGeneratingAnalysis(false);
      setLoading(false);
    }
  };
  useEffect(() => {
    generateAnalysis();
  }, [selectedPeriod]);

  const getCategorySummary = (data: Transaction[]) => {
    return data.reduce(
      (acc, transaction) => {
        acc[transaction.category] =
          (acc[transaction.category] || 0) + transaction.amount;
        return acc;
      },
      {} as Record<string, number>,
    );
  };

  const analyzeSpendingPatterns = (data: Transaction[]) => {
    const patterns = {
      weekday: {} as Record<string, number>,
      hourly: {} as Record<string, number>,
      weekly: {} as Record<string, number>,
    };

    data.forEach((transaction) => {
      const date = new Date(transaction.date);
      const weekday = date.toLocaleDateString('bg-BG', { weekday: 'long' });
      const hour = date.getHours();
      const week = Math.floor(date.getDate() / 7);

      patterns.weekday[weekday] =
        (patterns.weekday[weekday] || 0) + transaction.amount;
      patterns.hourly[hour] = (patterns.hourly[hour] || 0) + transaction.amount;
      patterns.weekly[week] = (patterns.weekly[week] || 0) + transaction.amount;
    });

    return patterns;
  };

  const analyzeTrends = (data: Transaction[]) => {
    return data
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .map((t) => ({
        x: new Date(t.date).getTime(),
        y: t.amount,
      }));
  };

  const prepareVisualizationData = (data: Transaction[]) => {
    setTimelineData(analyzeTrends(data));
    setCategoryTrends(prepareCategoryTrends(data));
  };

  const prepareCategoryTrends = (data: Transaction[]) => {
    const categories = [...new Set(data.map((t) => t.category))];
    return categories.map((category) => ({
      name: category,
      data: data
        .filter((t) => t.category === category)
        .map((t) => ({
          x: new Date(t.date).getTime(),
          y: t.amount,
        }))
        .sort((a, b) => a.x - b.x),
    }));
  };

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
            <button
              onClick={generateAnalysis}
              disabled={isGeneratingAnalysis}
              className={`px-6 py-3 rounded-lg ${
                isDarkMode
                  ? 'bg-sky-500 hover:bg-sky-600'
                  : 'bg-sky-400 hover:bg-sky-500'
              } text-white transition-all duration-200 ${
                isGeneratingAnalysis ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isGeneratingAnalysis
                ? 'Генериране на анализ...'
                : 'Генерирай нов AI анализ'}
            </button>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-8 py-8 pt-20">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-sky-500"></div>
            </div>
          ) : (
            <>
              {aiAnalysis && (
                <div
                  className={`mb-8 p-6 rounded-xl ${
                    isDarkMode ? 'bg-slate-800/50' : 'bg-white/50'
                  } backdrop-blur-sm shadow-sm`}
                >
                  <h2
                    className={`text-3xl font-bold mb-6 ${
                      isDarkMode ? 'text-white' : 'text-slate-800'
                    }`}
                  >
                    AI Анализ на финансовото състояние
                  </h2>

                  <div className="space-y-8">
                    <div
                      className={`p-6 rounded-lg ${
                        isDarkMode ? 'bg-slate-700/50' : 'bg-slate-50/50'
                      }`}
                    >
                      <h3 className="text-xl font-bold mb-4">
                        Обобщение на финансовото състояние
                      </h3>
                      <p className="text-lg mb-6">
                        {aiAnalysis.analysis.overallSummary.mainFindings}
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-medium text-sky-400 mb-3">
                            Ключови изводи
                          </h4>
                          <ul className="space-y-2">
                            {aiAnalysis.analysis.overallSummary.keyInsights.map(
                              (insight: string, index: number) => (
                                <li
                                  key={index}
                                  className="flex items-start gap-2"
                                >
                                  <span className="text-sky-400">•</span>
                                  <span>{insight}</span>
                                </li>
                              ),
                            )}
                          </ul>
                        </div>

                        <div>
                          <h4 className="font-medium text-rose-400 mb-3">
                            Рискови области
                          </h4>
                          <ul className="space-y-2">
                            {aiAnalysis.analysis.overallSummary.riskAreas.map(
                              (risk: string, index: number) => (
                                <li
                                  key={index}
                                  className="flex items-start gap-2"
                                >
                                  <span className="text-rose-400">•</span>
                                  <span>{risk}</span>
                                </li>
                              ),
                            )}
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div
                      className={`p-6 rounded-lg ${
                        isDarkMode ? 'bg-slate-700/50' : 'bg-slate-50/50'
                      }`}
                    >
                      <h3 className="text-xl font-bold mb-4">
                        Анализ по категории
                      </h3>
                      <div className="space-y-6">
                        {aiAnalysis.analysis.categoryAnalysis.categoryBreakdown.map(
                          (category: any, index: number) => (
                            <div
                              key={index}
                              className="border-b border-gray-700 pb-6 last:border-0"
                            >
                              <h4 className="font-medium text-lg mb-3">
                                {category.category}
                              </h4>
                              <p className="mb-4">{category.analysis}</p>
                              <p className="mb-4 text-sky-400">
                                {category.trends}
                              </p>
                              <ul className="space-y-2">
                                {category.recommendations.map(
                                  (rec: string, idx: number) => (
                                    <li
                                      key={idx}
                                      className="flex items-start gap-2"
                                    >
                                      <span className="text-emerald-400">
                                        •
                                      </span>
                                      <span>{rec}</span>
                                    </li>
                                  ),
                                )}
                              </ul>
                            </div>
                          ),
                        )}
                      </div>
                    </div>

                    <div
                      className={`p-6 rounded-lg ${
                        isDarkMode ? 'bg-slate-700/50' : 'bg-slate-50/50'
                      }`}
                    >
                      <h3 className="text-xl font-bold mb-4">
                        Поведенчески анализ
                      </h3>
                      <p className="mb-6">
                        {
                          aiAnalysis.analysis.behavioralInsights
                            .spendingPatterns
                        }
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-medium text-violet-400 mb-3">
                            Емоционални тригери
                          </h4>
                          <ul className="space-y-2">
                            {aiAnalysis.analysis.behavioralInsights.emotionalTriggers.map(
                              (trigger: string, index: number) => (
                                <li
                                  key={index}
                                  className="flex items-start gap-2"
                                >
                                  <span className="text-violet-400">•</span>
                                  <span>{trigger}</span>
                                </li>
                              ),
                            )}
                          </ul>
                        </div>

                        <div>
                          <h4 className="font-medium text-amber-400 mb-3">
                            Социални фактори
                          </h4>
                          <p>
                            {
                              aiAnalysis.analysis.behavioralInsights
                                .socialFactors
                            }
                          </p>
                        </div>
                      </div>
                    </div>

                    <div
                      className={`p-6 rounded-lg ${
                        isDarkMode ? 'bg-slate-700/50' : 'bg-slate-50/50'
                      }`}
                    >
                      <h3 className="text-xl font-bold mb-4">
                        Образователни насоки
                      </h3>
                      <p className="mb-6">
                        {
                          aiAnalysis.analysis.educationalGuidance
                            .financialLiteracy
                        }
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-medium text-emerald-400 mb-3">
                            Практически умения
                          </h4>
                          <ul className="space-y-2">
                            {aiAnalysis.analysis.educationalGuidance.practicalSkills.map(
                              (skill: string, index: number) => (
                                <li
                                  key={index}
                                  className="flex items-start gap-2"
                                >
                                  <span className="text-emerald-400">•</span>
                                  <span>{skill}</span>
                                </li>
                              ),
                            )}
                          </ul>
                        </div>

                        <div>
                          <h4 className="font-medium text-sky-400 mb-3">
                            Препоръчани ресурси
                          </h4>
                          <ul className="space-y-2">
                            {aiAnalysis.analysis.educationalGuidance.resources.map(
                              (resource: string, index: number) => (
                                <li
                                  key={index}
                                  className="flex items-start gap-2"
                                >
                                  <span className="text-sky-400">•</span>
                                  <span>{resource}</span>
                                </li>
                              ),
                            )}
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div
                      className={`p-6 rounded-lg ${
                        isDarkMode ? 'bg-slate-700/50' : 'bg-slate-50/50'
                      }`}
                    >
                      <h3 className="text-xl font-bold mb-4">
                        Бъдещи прогнози
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                          <h4 className="font-medium text-sky-400 mb-3">
                            Следващ месец
                          </h4>
                          <p>
                            {aiAnalysis.analysis.futureProjections.nextMonth}
                          </p>
                        </div>

                        <div>
                          <h4 className="font-medium text-violet-400 mb-3">
                            Тримесечна прогноза
                          </h4>
                          <p>
                            {aiAnalysis.analysis.futureProjections.threeMonths}
                          </p>
                        </div>

                        <div>
                          <h4 className="font-medium text-emerald-400 mb-3">
                            План за спестявания
                          </h4>
                          <p>
                            {
                              aiAnalysis.analysis.futureProjections
                                .savingsPotential
                            }
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

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
                                formatter: () =>
                                  `${totalExpenses.toFixed(2)} лв.`,
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

                <div
                  className={`p-6 rounded-xl ${
                    isDarkMode ? 'bg-slate-800/50' : 'bg-white/50'
                  } backdrop-blur-sm shadow-sm`}
                >
                  <h2 className="text-xl font-bold mb-6">
                    Тенденции във времето
                  </h2>
                  <ApexCharts
                    options={{
                      chart: {
                        type: 'area',
                        background: 'transparent',
                        toolbar: {
                          show: false,
                        },
                      },
                      xaxis: {
                        type: 'datetime',
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
                          formatter: (value) => `${value.toFixed(2)} лв.`,
                        },
                      },
                      stroke: {
                        curve: 'smooth',
                      },
                      fill: {
                        type: 'gradient',
                        gradient: {
                          shadeIntensity: 1,
                          opacityFrom: 0.7,
                          opacityTo: 0.3,
                        },
                      },
                      colors: ['#38BDF8'],
                      tooltip: {
                        y: {
                          formatter: (value) => `${value.toFixed(2)} лв.`,
                        },
                      },
                    }}
                    series={[
                      {
                        name: 'Разходи',
                        data: timelineData,
                      },
                    ]}
                    type="area"
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

export default ExpenseAnalytics;
