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

// Генериране на PDF
export const generatePDF = async (dateRange: {
  start: string;
  end: string;
}) => {
  const data = await getReportData(dateRange.start, dateRange.end);
  const doc = new jsPDF();

  // Заглавие
  doc.setFontSize(20);
  doc.text('Финансова справка', 14, 15);

  // Обобщение
  doc.setFontSize(12);
  doc.text(`Период: ${dateRange.start} - ${dateRange.end}`, 14, 25);
  doc.text(`Общ приход: ${data.totalIncome.toFixed(2)} лв.`, 14, 35);
  doc.text(`Общ разход: ${data.totalExpenses.toFixed(2)} лв.`, 14, 45);
  doc.text(`Баланс: ${data.balance.toFixed(2)} лв.`, 14, 55);

  // Таблица с транзакции
  const tableData = data.transactions.map((t) => [
    t.date,
    t.category,
    t.description,
    `${t.type === 'income' ? '+' : '-'}${t.amount.toFixed(2)} лв.`,
  ]);

  (doc as any).autoTable({
    startY: 65,
    head: [['Дата', 'Категория', 'Описание', 'Сума']],
    body: tableData,
    theme: 'grid',
  });

  return doc.output('arraybuffer');
};

// Генериране на Excel
export const generateExcel = async (dateRange: {
  start: string;
  end: string;
}) => {
  const data = await getReportData(dateRange.start, dateRange.end);
  const wb = XLSX.utils.book_new();

  // Обобщение
  const summaryData = [
    ['Финансова справка'],
    [`Период: ${dateRange.start} - ${dateRange.end}`],
    [''],
    ['Общ приход', data.totalIncome],
    ['Общ разход', data.totalExpenses],
    ['Баланс', data.balance],
  ];
  const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
  XLSX.utils.book_append_sheet(wb, summarySheet, 'Обобщение');

  // Транзакции
  const transactionsData = data.transactions.map((t) => [
    t.date,
    t.category,
    t.description,
    t.type === 'income' ? t.amount : -t.amount,
  ]);
  const transactionsSheet = XLSX.utils.aoa_to_sheet([
    ['Дата', 'Категория', 'Описание', 'Сума'],
    ...transactionsData,
  ]);
  XLSX.utils.book_append_sheet(wb, transactionsSheet, 'Транзакции');

  // Разходи по категории
  const categoriesData = Object.entries(data.categoryTotals).map(
    ([category, amount]) => [category, amount],
  );
  const categoriesSheet = XLSX.utils.aoa_to_sheet([
    ['Категория', 'Сума'],
    ...categoriesData,
  ]);
  XLSX.utils.book_append_sheet(wb, categoriesSheet, 'Разходи по категории');

  return XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
};

// Изпращане на имейл
export const sendReportEmail = async (
  email: string,
  dateRange: { start: string; end: string },
) => {
  const pdfBuffer = await generatePDF(dateRange);

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Финансова справка',
    text: `Вашата финансова справка за периода ${dateRange.start} - ${dateRange.end}`,
    attachments: [
      {
        filename: 'financial-report.pdf',
        content: Buffer.from(pdfBuffer),
      },
    ],
  });
};

// Вземане на данни за справката
export const getReportData = async (start: string, end: string) => {
  // TODO: Имплементирайте връзка с базата данни
  // За момента връщаме тестови данни
  return {
    totalIncome: 5000,
    totalExpenses: 3000,
    balance: 2000,
    transactions: [
      {
        id: 1,
        date: '2024-03-01',
        category: 'Заплата',
        description: 'Месечна заплата',
        amount: 3000,
        type: 'income' as const,
      },
      {
        id: 2,
        date: '2024-03-02',
        category: 'Храни',
        description: 'Покупки от супермаркет',
        amount: 200,
        type: 'expense' as const,
      },
    ],
    categoryTotals: {
      Храни: 200,
      Транспорт: 150,
      Развлечения: 300,
    },
  };
};
