import { Transaction } from './expense-analytics-types';

export const getCategorySummary = (data: Transaction[]) => {
  return data.reduce(
    (acc, transaction) => {
      acc[transaction.category] =
        (acc[transaction.category] || 0) + transaction.amount;
      return acc;
    },
    {} as Record<string, number>,
  );
};

export const analyzeSpendingPatterns = (data: Transaction[]) => {
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

export const analyzeTrends = (data: Transaction[]) => {
  return data
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map((t) => ({
      x: new Date(t.date).getTime(),
      y: t.amount,
    }));
};

export const fetchTransactionData = async (selectedPeriod: number) => {
  try {
    const token =
      localStorage.getItem('authToken') || sessionStorage.getItem('authToken');

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
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - selectedPeriod);

    const filteredTransactions = expenseTransactions.filter(
      (t: Transaction) => {
        const transactionDate = new Date(t.date);
        return (
          !isNaN(transactionDate.getTime()) && transactionDate >= thirtyDaysAgo
        );
      },
    );

    console.log('filteredTransactions: ', filteredTransactions);

    const totalSpent = filteredTransactions.reduce(
      (sum: number, t: Transaction) => sum + t.amount,
      0,
    );

    const totalBalance = data.transactions.reduce(
      (sum: number, t: Transaction) =>
        sum + (t.type === 'income' ? t.amount : -t.amount),
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

export const fetchLastAIAnalysis = async () => {
  try {
    const token =
      localStorage.getItem('authToken') || sessionStorage.getItem('authToken');

    if (!token) {
      throw new Error('Authentication token not found');
    }

    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/get-last-expense-analysis`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      },
    );

    if (!response.ok) {
      throw new Error('Failed to fetch last expense analysis');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching last expense analysis:', error);
  } finally {
  }
};

export const generateAnalysis = async (
  selectedPeriod: number,
  setIsGeneratingAnalysis: React.Dispatch<React.SetStateAction<boolean>>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setAiAnalysis: React.Dispatch<React.SetStateAction<any>>,
  transactions: Transaction[],
) => {
  setIsGeneratingAnalysis(true);
  try {
    const token =
      localStorage.getItem('authToken') || sessionStorage.getItem('authToken');

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
    const savingsRate =
      analysisData.totalIncome !== 0
        ? ((analysisData.totalIncome - analysisData.totalSpent) /
            analysisData.totalIncome) *
          100
        : 0;

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
          savings_rate: savingsRate,
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
