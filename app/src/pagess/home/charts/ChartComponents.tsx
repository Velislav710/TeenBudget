import ReactApexChart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';

export const ExpenseChart = ({ data, isDarkMode }) => {
  const options: ApexOptions = {
    chart: {
      type: 'area',
      background: 'transparent',
      foreColor: isDarkMode ? '#fff' : '#000',
    },
    theme: {
      mode: isDarkMode ? 'dark' : 'light',
    },
    stroke: {
      curve: 'smooth',
      width: 2,
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.3,
      },
    },
  };

  return (
    <ReactApexChart options={options} series={data} type="area" height={350} />
  );
};
