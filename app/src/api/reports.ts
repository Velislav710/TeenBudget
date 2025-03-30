import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import nodemailer from 'nodemailer';

// Конфигурация на имейл транспорта
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

interface ReportData {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  transactions: Array<{
    id: number;
    date: string;
    category: string;
    description: string;
    amount: number;
    type: 'income' | 'expense';
  }>;
  categoryTotals: Record<string, number>;
}

interface DateRange {
  start: string;
  end: string;
}

// Функция за генериране на PDF
export async function generatePDF(
  reportData: ReportData,
): Promise<ArrayBuffer> {
  const doc = new jsPDF();

  // Заглавие
  doc.setFontSize(20);
  doc.text('Финансова справка', 14, 15);
  doc.setFontSize(12);

  // Обобщение
  doc.setFontSize(14);
  doc.text('Обобщение', 14, 30);
  doc.setFontSize(12);
  doc.text(`Общ приход: ${reportData.totalIncome.toFixed(2)} лв.`, 14, 40);
  doc.text(`Общ разход: ${reportData.totalExpenses.toFixed(2)} лв.`, 14, 50);
  doc.text(`Баланс: ${reportData.balance.toFixed(2)} лв.`, 14, 60);

  // Таблица с транзакции
  const tableData = reportData.transactions.map((t) => [
    t.date,
    t.category,
    t.description,
    t.type === 'income' ? `${t.amount.toFixed(2)} лв.` : '',
    t.type === 'expense' ? `${t.amount.toFixed(2)} лв.` : '',
  ]);

  (doc as any).autoTable({
    startY: 70,
    head: [['Дата', 'Категория', 'Описание', 'Приход', 'Разход']],
    body: tableData,
    theme: 'grid',
  });

  return doc.output('arraybuffer');
}

// Функция за генериране на Excel
export async function generateExcel(reportData: ReportData): Promise<Buffer> {
  const wb = XLSX.utils.book_new();

  // Обобщение
  const summaryData = [
    ['Обобщение'],
    ['Общ приход', reportData.totalIncome],
    ['Общ разход', reportData.totalExpenses],
    ['Баланс', reportData.balance],
  ];
  const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
  XLSX.utils.book_append_sheet(wb, summarySheet, 'Обобщение');

  // Транзакции
  const transactionsData = reportData.transactions.map((t) => [
    t.date,
    t.category,
    t.description,
    t.type === 'income' ? t.amount : '',
    t.type === 'expense' ? t.amount : '',
  ]);
  transactionsData.unshift([
    'Дата',
    'Категория',
    'Описание',
    'Приход',
    'Разход',
  ]);
  const transactionsSheet = XLSX.utils.aoa_to_sheet(transactionsData);
  XLSX.utils.book_append_sheet(wb, transactionsSheet, 'Транзакции');

  // Разходи по категории
  const categoryData = Object.entries(reportData.categoryTotals).map(
    ([category, total]) => [category, total],
  );
  categoryData.unshift(['Категория', 'Сума']);
  const categorySheet = XLSX.utils.aoa_to_sheet(categoryData);
  XLSX.utils.book_append_sheet(wb, categorySheet, 'Разходи по категории');

  return XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
}

// Функция за изпращане на имейл
export async function sendReportEmail(
  email: string,
  reportData: ReportData,
): Promise<boolean> {
  try {
    const pdfBuffer = await generatePDF(reportData);
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Вашата финансова справка',
      text: 'Моля, намерете прикачената финансова справка.',
      attachments: [
        {
          filename: 'financial-report.pdf',
          content: Buffer.from(pdfBuffer),
        },
      ],
    });
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
}

// Функция за взимане на данни за справката
export async function getReportData(
  start: string,
  end: string,
): Promise<ReportData> {
  // Mock data for testing - later this will be replaced with actual database queries
  const mockData: ReportData = {
    totalIncome: 5000,
    totalExpenses: 3000,
    balance: 2000,
    transactions: [
      {
        id: 1,
        date: '2024-03-01',
        category: 'Заплата',
        description: 'Месечна заплата',
        amount: 5000,
        type: 'income',
      },
      {
        id: 2,
        date: '2024-03-02',
        category: 'Храна',
        description: 'Седмични покупки',
        amount: 200,
        type: 'expense',
      },
    ],
    categoryTotals: {
      Храна: 200,
      Транспорт: 100,
      Развлечения: 300,
    },
  };

  return mockData;
}
