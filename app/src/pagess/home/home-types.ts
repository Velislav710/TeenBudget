export interface TransactionAnalysisData {
  transactions: {
    type: 'income' | 'expense';
    category: string;
    amount: number;
    description: string; // description?: string;
  }[];
  totalBalance: number;
}
