export interface Transaction {
  id: number;
  type: 'expense';
  amount: number;
  category: string;
  description: string;
  date: string;
}

export interface TimelineData {
  x: number;
  y: number;
}
