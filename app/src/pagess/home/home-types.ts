export interface TransactionAnalysisData {
  transactions: {
    type: 'income' | 'expense';
    category: string;
    amount: number;
    description: string; // description?: string;
  }[];
  totalBalance: number;
}

export interface DashboardAnalysis {
  userId: number;
  summary: string;
  recommendations: string[];
  savingsPotential: string; // savings potential is stored as a string (can be a number in some cases)
  monthlyTrend: string;
  topCategory: string;
  date: string; // Assuming date is a string in YYYY-MM-DD format, but you can use Date type if needed
}
