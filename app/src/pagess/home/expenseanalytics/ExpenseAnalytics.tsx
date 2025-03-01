import React, { useState, useEffect } from 'react';
import { useTheme } from '../../../context/ThemeContext';
import ThemeToggle from '../../../components/ThemeToggle';
import ApexCharts from 'react-apexcharts';
import SideMenu from '../../../components/SideMenu';
import Footer from '../../../components/Footerr/Footer';
import { fetchExpenseAnalytics } from '../helper-functions';
import { TimelineData, Transaction } from './expense-analytics-types';
import {
  getCategorySummary,
  analyzeSpendingPatterns,
  analyzeTrends,
  prepareVisualizationData,
} from './helper-functions';

const ExpenseAnalytics = () => {
  const { isDarkMode } = useTheme();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);
  const [isGeneratingAnalysis, setIsGeneratingAnalysis] = useState(false);
  const [timelineData, setTimelineData] = useState<TimelineData[]>([]);
  const selectedPeriod = 30;

  const fetchTransactionData = async (selectedPeriod: number) => {
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

      if (!response.ok) throw new Error('Failed to fetch transactions');

      const data = await response.json();
      const expenseTransactions = data.transactions.filter(
        (t: Transaction) => t.type === 'expense',
      );

      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - selectedPeriod);

      const filteredTransactions = expenseTransactions.filter(
        (t: Transaction) => {
          const transactionDate = new Date(t.date);
          return (
            !isNaN(transactionDate.getTime()) &&
            transactionDate >= thirtyDaysAgo
          );
        },
      );

      console.log('filteredTransactions: ', filteredTransactions);

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

      return {
        filteredTransactions,
        totalSpent,
        totalBalance,
        totalIncome,
        allTransactions: data.transactions,
      };
    } catch (error) {
      console.error('Error fetching transaction data:', error);
      throw error;
    }
  };

  const generateAnalysis = async (selectedPeriod: number) => {
    setIsGeneratingAnalysis(true);
    try {
      const token =
        localStorage.getItem('authToken') ||
        sessionStorage.getItem('authToken');

      const { totalSpent, totalBalance, totalIncome } =
        await fetchTransactionData(selectedPeriod);

      const analysisData = {
        transactions: transactions,
        period: selectedPeriod + ' days',
        totalSpent,
        totalBalance,
        totalIncome,
        categorySummary: getCategorySummary(transactions),
        spendingPatterns: analyzeSpendingPatterns(transactions),
        trends: analyzeTrends(transactions),
      };

      console.log('analysisData: ', analysisData);
      const aiResult = {
        analysis: {
          overallSummary: {
            mainFindings:
              'Извършен е анализ на финансовите постижения на тийнейджър за периода от 30 дни. Сумата от всехидни разходи е 50 лв., което представлява близо 31,65% от тоталния приход за същия период (158 лв.). Най-голямата категория разходи е свързана с храната. Интересно е, че всички разходи са направени в петък вследствие на една транзакция в полунощ.',
            keyInsights: [
              'Общите разходи за периода са 50 лв.',
              '31,65% от приходите са изразходвани.',
              'Всички разходи са направени в петък на полунощ.',
            ],
            riskAreas: [
              'Фокусирането на разходите в един единствен ден от седмицата може да доведе до недостатъчност на финансите в останалите дни.',
              ' Всички разходи са причинени от един вид консумация – хранене.',
              'Направените разходи са концентрирани в едно определено часово интервало (полунощ), което може да ограничи флексибилността при други евентуални нужди.',
            ],
          },
          categoryAnalysis: {
            topCategory: 'Храна',
            categoryBreakdown: [
              {
                category: 'Храна',
                analysis:
                  'Тийнейджърът е харчил всичките си средства за храна. Това може да е рационално, ако средствата са били използвани за покупка на бълк храна или други необходимости за пълноценно питане през един или повече дни и ако други основни нужди като дрехи, транспорт и др. са удовлетворени чрез други източници на финансиране или са обеспечени по друг начин.',
                trends:
                  'Има консистентен тенд към потребление цялата своя наличност на пари за храна.',
                recommendations: [
                  'Разнообразяване на разходите в рамките на седмицата.',
                  'Разходите да бъдат разпределени между различни категории за по-голям баланс.',
                  'Избягване на покупките в късни часове, за да се има по-голяма финансова гъвкавост през деня.',
                ],
              },
            ],
          },
          behavioralInsights: {
            spendingPatterns:
              'В цялостните навици за харчене се забелязва модел на концентриране на разходите върху една категория (храна) и в определен ден от седмицата (петък). Това могат да бъдат знаци за липса на разнообразие и баланс в разходите и на потребление на продуктите на веднъж.',
            emotionalTriggers: [
              'Свързаност с края на работната седмица (петък).',
              'Желание за удоволствие от храна след работната седмица.',
              'Потребление на храна като механизъм за справяне със стреса.',
            ],
            socialFactors:
              'Уикендът може да бъде период, през който тийнейджърите провеждат повече социална активност и по този начин покачват своите разходи по храна.',
          },
          detailedRecommendations: {
            immediate: [
              'Създаване на ежеседмичен бюджет за категориата храна.',
              'Разнообразяване на дните, в които се правят покупки.',
              'Приоритизиране на нуждите, като се взимат предвид и други категории разходи извън храна.',
            ],
            shortTerm: [
              'Опитване на различни стратегии за пазаруване.',
              'Постепенно намаляне на разходите за храна, за да се осигури пари за други категории.',
              'Инвестиране в обучение по финансово планиране.',
            ],
            longTerm: [
              'Разработване на сберегателен план.',
              'Успоредно влагане в умения за печелене на повече приходи.',
              'Създаване на дългосрочен план за разходи, включващ различни категории.',
            ],
          },
          educationalGuidance: {
            financialLiteracy:
              'Важно е тийнейджърът да разбере как седмичното и месечното планиране на бюджета могат да помогнат за постигане на по-добър финансов баланс и за намаляване на риска от изчерпване на средствата през началото на периода. Финансовата грамотност включва и разбирането на важността от разпределяне на разходите между различни категории и избягването на прекомерни разходи в определени дни или часове от деня.',
            practicalSkills: [
              'Управление на бюджет.',
              'Планиране на разходи.',
              'Разбиране на впливащи фактори върху разходите.',
            ],
            resources: [
              'Финансови планиращи инструменти.',
              'Книги и онлайн курсове по финансово образование.',
              'Ментори и консултанти по финанси.',
            ],
          },
          futureProjections: {
            nextMonth:
              'Ако същото поведение продължи, тийнейджърът вероятно ще изпита същите променливи финансови резултати през следващия месец.',
            threeMonths:
              'Ако не въведе промени в своите финансови навици, той може да се сблъска с многократно повтаряне на същите проблеми и да бъде изправен пред финансови трудности.',
            savingsPotential:
              'Ако тийнейджърът можете да намали 20% от своите разходи за храна всеки месец, той може да спести 10 лв. от бюджета си за храна само за пръв месец, или общо 30 лв. за три месеца.',
          },
        },
      };
      console.log('token: ', token);

      setAiAnalysis(aiResult);

      await fetch(
        `${(import.meta as any).env.VITE_API_BASE_URL}/save-expense-analysis`,
        {
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

            top_category: aiResult.analysis.categoryAnalysis.topCategory,
            category_breakdown: JSON.stringify(
              aiResult.analysis.categoryAnalysis.categoryBreakdown,
            ),

            spending_patterns:
              aiResult.analysis.behavioralInsights.spendingPatterns,
            emotional_triggers: JSON.stringify(
              aiResult.analysis.behavioralInsights.emotionalTriggers,
            ),
            social_factors: aiResult.analysis.behavioralInsights.socialFactors,

            immediate_recommendations: JSON.stringify(
              aiResult.analysis.detailedRecommendations.immediate,
            ),
            short_term_recommendations: JSON.stringify(
              aiResult.analysis.detailedRecommendations.shortTerm,
            ),
            long_term_recommendations: JSON.stringify(
              aiResult.analysis.detailedRecommendations.longTerm,
            ),

            financial_literacy:
              aiResult.analysis.educationalGuidance.financialLiteracy,

            practical_skills: JSON.stringify(
              aiResult.analysis.educationalGuidance.practicalSkills,
            ),
            resources: JSON.stringify(
              aiResult.analysis.educationalGuidance.resources,
            ),
            next_month_future_projection:
              aiResult.analysis.futureProjections.nextMonth,
            three_month_future_projection:
              aiResult.analysis.futureProjections.threeMonths,
            savings_potential_future_projection:
              aiResult.analysis.futureProjections.savingsPotential,
            date: new Date(),
          }),
        },
      );

      setIsGeneratingAnalysis(false);
      setLoading(false);
    } catch (error) {
      console.error('Error generating analysis:', error);
      setIsGeneratingAnalysis(false);
      setLoading(false);
    }
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

  useEffect(() => {
    const fetchDatabaseTransactions = async () => {
      const { filteredTransactions } = await fetchTransactionData(
        selectedPeriod,
      );
      setTransactions(filteredTransactions);
      prepareVisualizationData(transactions, setTimelineData);
    };

    fetchDatabaseTransactions();
  }, []);

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
              onClick={() => generateAnalysis(selectedPeriod)}
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
                  className={`my-8 p-6 rounded-xl ${
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

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 my-8">
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
