import React from 'react';
import ReactApexChart from 'react-apexcharts';
import { categories } from '../config/categories';

interface TransactionChartsProps {
  isDarkMode: boolean;
  chartView: 'income' | 'expense' | 'both';
  setChartView: (view: 'income' | 'expense' | 'both') => void;
  currentMonths: { label: string; number: number }[];
  getMonthlyData: (type: 'income' | 'expense', month: number) => number;
  transactions: any[];
}

const TransactionCharts = ({
  isDarkMode,
  chartView,
  setChartView,
  currentMonths,
  getMonthlyData,
  transactions,
}: TransactionChartsProps) => {
  const apexChartOptions = {
    chart: {
      type: 'area' as const,
      background: 'transparent',
      foreColor: isDarkMode ? '#fff' : '#000',
    },
    colors: ['#10b981', '#ef4444'],
    theme: {
      mode: isDarkMode ? 'dark' : 'light',
    },
    stroke: {
      curve: 'smooth' as const,
      width: 3,
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.8,
        opacityTo: 0.4,
        stops: [0, 90, 100],
      },
    },
    xaxis: {
      categories: currentMonths.map((m) => m.label),
    },
    yaxis: {
      labels: {
        formatter: (value: number) => `${value.toFixed(0)} лв.`,
      },
    },
    tooltip: {
      y: {
        formatter: (value: number) => `${value.toFixed(2)} лв.`,
      },
    },
  };

  const apexChartSeries = [
    {
      name: 'Приходи',
      data: currentMonths.map((m) => getMonthlyData('income', m.number)),
    },
    {
      name: 'Разходи',
      data: currentMonths.map((m) => getMonthlyData('expense', m.number)),
    },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
      <div
        className={`p-6 rounded-xl ${
          isDarkMode ? 'bg-gray-800/90' : 'bg-white/90'
        } shadow-xl backdrop-blur-sm`}
      >
        <h2
          className={`text-2xl font-bold mb-6 ${
            isDarkMode ? 'text-white' : 'text-gray-800'
          }`}
        >
          Месечен анализ
        </h2>
        <div style={{ height: '400px' }}>
          <ReactApexChart
            options={apexChartOptions}
            series={apexChartSeries}
            type="area"
            height="100%"
          />
        </div>
      </div>

      <div
        className={`p-6 rounded-xl ${
          isDarkMode ? 'bg-gray-800/90' : 'bg-white/90'
        } shadow-xl backdrop-blur-sm`}
      >
        <div className="flex justify-between items-center mb-6">
          <h2
            className={`text-2xl font-bold ${
              isDarkMode ? 'text-white' : 'text-gray-800'
            }`}
          >
            Разпределение по категории
          </h2>
          <select
            value={chartView}
            onChange={(e) =>
              setChartView(e.target.value as 'income' | 'expense' | 'both')
            }
            className={`rounded-xl p-2 ${
              isDarkMode
                ? 'bg-gray-700 text-white border-gray-600'
                : 'bg-gray-50 border-gray-200'
            } border-2 focus:ring-2 focus:ring-emerald-500 transition-all`}
          >
            <option value="both">Всички</option>
            <option value="income">Само приходи</option>
            <option value="expense">Само разходи</option>
          </select>
        </div>
        <div style={{ height: '400px' }}>
          <ReactApexChart
            options={{
              ...apexChartOptions,
              chart: {
                ...apexChartOptions.chart,
                type: 'donut',
              },
              labels: categories[chartView === 'both' ? 'income' : chartView],
              colors:
                chartView === 'income'
                  ? ['#10b981', '#34d399', '#6ee7b7', '#a7f3d0']
                  : ['#ef4444', '#f87171', '#fca5a5', '#fecaca', '#fee2e2'],
            }}
            series={categories[chartView === 'both' ? 'income' : chartView].map(
              (category) =>
                transactions
                  .filter(
                    (t) =>
                      t.type ===
                        (chartView === 'both' ? 'income' : chartView) &&
                      t.category === category,
                  )
                  .reduce((sum, t) => sum + t.amount, 0),
            )}
            type="donut"
            height="100%"
          />
        </div>
      </div>
    </div>
  );
};
export default TransactionCharts;
