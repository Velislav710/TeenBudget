import { fetchExpenseAnalytics } from '../helper-functions';
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
    const aiResult = await fetchExpenseAnalytics(analysisData);
    console.log('aiResult: ', aiResult);
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
