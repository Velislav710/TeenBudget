import { TimelineData, Transaction } from './expense-analytics-types';

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

export const prepareVisualizationData = (
  data: Transaction[],
  setTimelineData: React.Dispatch<TimelineData[]>,
) => {
  setTimelineData(analyzeTrends(data));
};
