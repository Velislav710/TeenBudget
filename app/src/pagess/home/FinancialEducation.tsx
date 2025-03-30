import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import ThemeToggle from '../../components/ThemeToggle';
import ApexCharts from 'react-apexcharts';
import SideMenu from '../../components/SideMenu';
import Footer from '../../components/Footerr/Footer';
import {
  FaPiggyBank,
  FaChartLine,
  FaSmile,
  FaLightbulb,
  FaCheckCircle,
  FaTimesCircle,
  FaGraduationCap,
  FaArrowRight,
  FaArrowLeft,
  FaTrophy,
  FaBook,
  FaCalculator,
  FaChartBar,
} from 'react-icons/fa';
import { motion, AnimatePresence, HTMLMotionProps } from 'framer-motion';

interface Scenario {
  id: number;
  title: string;
  description: string;
  options: {
    text: string;
    impact: {
      balance: number;
      savings: number;
      happiness: number;
      habits: string[];
    };
    explanation: string;
  }[];
}

interface Habit {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
}

interface Tutorial {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  content: string;
  examples: string[];
}

const scenarios: Scenario[] = [
  {
    id: 1,
    title: 'Джобни пари',
    description: 'Получихте 100 лв. джобни пари. Как ще ги използвате?',
    options: [
      {
        text: 'Запазите всички за спестявания',
        impact: {
          balance: 100,
          savings: 100,
          happiness: 0,
          habits: ['Спестяване', 'Отсрочено удовлетворение'],
        },
        explanation: 'Отлично решение! Спестяването е ключов финансов навик.',
      },
      {
        text: 'Купите нова игра',
        impact: {
          balance: -60,
          savings: 0,
          happiness: 80,
          habits: ['Импулсивно харчене'],
        },
        explanation:
          'Внимавайте с импулсивните покупки - те могат да попречат на вашите финансови цели.',
      },
      {
        text: 'Разделете на две - половината за спестявания, половината за удоволствия',
        impact: {
          balance: 50,
          savings: 50,
          happiness: 40,
          habits: ['Балансирано харчене', 'Умереност'],
        },
        explanation:
          'Добър баланс! Важно е да се наслаждаваме, но и да мислим за бъдещето.',
      },
    ],
  },
  {
    id: 2,
    title: 'Неочакван разход',
    description: 'Телефонът ви се повреди и трябва ремонт на стойност 50 лв.',
    options: [
      {
        text: 'Използвате спестяванията',
        impact: {
          balance: -50,
          savings: -50,
          happiness: 0,
          habits: ['Финансов резерв'],
        },
        explanation: 'Добро решение! Спестяванията са за неочаквани разходи.',
      },
      {
        text: 'Изчаквате до следващия месец',
        impact: {
          balance: 0,
          savings: 0,
          happiness: -30,
          habits: ['Отлагане на проблеми'],
        },
        explanation:
          'Отлагането на проблеми може да доведе до по-големи разходи в бъдеще.',
      },
      {
        text: 'Търсите по-евтин вариант за ремонт',
        impact: {
          balance: -30,
          savings: -30,
          happiness: 20,
          habits: ['Сравняване на цени', 'Търсене на алтернативи'],
        },
        explanation:
          'Отлично! Търсенето на по-добри цени е важен финансов навик.',
      },
    ],
  },
  {
    id: 3,
    title: 'Стипендия',
    description:
      'Получихте месечна стипендия от 200 лв. Как ще я разпределите?',
    options: [
      {
        text: 'Правило 50/30/20',
        impact: {
          balance: 200,
          savings: 40,
          happiness: 60,
          habits: ['Бюджетиране', 'Правило 50/30/20'],
        },
        explanation:
          'Отлично! Правилото 50/30/20 е доказан метод за управление на пари.',
      },
      {
        text: 'Всичко за развлечения',
        impact: {
          balance: 0,
          savings: 0,
          happiness: 100,
          habits: ['Импулсивно харчене'],
        },
        explanation: 'Важно е да се забавляваме, но не забравяйте за бъдещето.',
      },
      {
        text: 'Спестяване за специална цел',
        impact: {
          balance: 150,
          savings: 150,
          happiness: 30,
          habits: ['Целево спестяване'],
        },
        explanation:
          'Добро решение! Спестяването за конкретна цел е мотивиращо.',
      },
    ],
  },
  {
    id: 4,
    title: 'Инвестиционна възможност',
    description:
      'Приятел ви предлага да инвестирате 50 лв. в негов стартиращ бизнес. Какво ще направите?',
    options: [
      {
        text: 'Инвестирате и следете развитието',
        impact: {
          balance: -50,
          savings: -50,
          happiness: 60,
          habits: ['Инвестиране', 'Анализ на риска'],
        },
        explanation:
          'Добро решение! Инвестирането е важно за финансов растеж, но внимавайте с рисковете.',
      },
      {
        text: 'Откажете и запазите парите',
        impact: {
          balance: 50,
          savings: 50,
          happiness: 30,
          habits: ['Консервативно управление'],
        },
        explanation:
          'Безопасен избор. Важно е да инвестирате само когато разбирате рисковете.',
      },
      {
        text: 'Помолите за повече информация',
        impact: {
          balance: 0,
          savings: 0,
          happiness: 40,
          habits: ['Добра оценка', 'Внимателност'],
        },
        explanation:
          'Отлично! Винаги трябва да събирате информация преди да инвестирате.',
      },
    ],
  },
  {
    id: 5,
    title: 'Кредитна ситуация',
    description: 'Нужни са ви 200 лв. за нов телефон. Какво ще направите?',
    options: [
      {
        text: 'Взимате потребителски кредит',
        impact: {
          balance: 200,
          savings: -20,
          happiness: 70,
          habits: ['Задлъжняване'],
        },
        explanation:
          'Внимавайте с кредитите - те могат да доведат до финансови проблеми.',
      },
      {
        text: 'Спестявате постепенно',
        impact: {
          balance: 0,
          savings: 50,
          happiness: 40,
          habits: ['Търпение', 'Финансова дисциплина'],
        },
        explanation: 'Отлично решение! Спестяването е по-добро от заемане.',
      },
      {
        text: 'Търсите по-евтин вариант',
        impact: {
          balance: -100,
          savings: -100,
          happiness: 60,
          habits: ['Сравняване на цени', 'Умереност'],
        },
        explanation:
          'Добър избор! Търсенето на по-добри цени е важен финансов навик.',
      },
    ],
  },
  {
    id: 6,
    title: 'Бизнес възможност',
    description:
      'Имате шанс да започнете малък онлайн бизнес с начална инвестиция от 100 лв.',
    options: [
      {
        text: 'Инвестирате и започвате',
        impact: {
          balance: -100,
          savings: -100,
          happiness: 80,
          habits: ['Предприемачество', 'Рисковане'],
        },
        explanation:
          'Смел избор! Предприемачеството може да донесе добри резултати.',
      },
      {
        text: 'Направите подробен план първо',
        impact: {
          balance: 0,
          savings: 0,
          happiness: 50,
          habits: ['Планиране', 'Анализ'],
        },
        explanation: 'Отлично! Доброто планиране е ключово за успех.',
      },
      {
        text: 'Търсите партньор',
        impact: {
          balance: -50,
          savings: -50,
          happiness: 60,
          habits: ['Сътрудничество', 'Споделен риск'],
        },
        explanation:
          'Добро решение! Споделянето на риска може да е по-безопасно.',
      },
    ],
  },
  {
    id: 7,
    title: 'Етична дилема',
    description: 'Намерихте 50 лв. на улицата. Какво ще направите?',
    options: [
      {
        text: 'Оставите си ги',
        impact: {
          balance: 50,
          savings: 50,
          happiness: 30,
          habits: ['Неетично поведение'],
        },
        explanation:
          'Внимавайте с етичните решения - те влияят на вашата репутация.',
      },
      {
        text: 'Опитвате да намерите собственика',
        impact: {
          balance: 0,
          savings: 0,
          happiness: 80,
          habits: ['Честност', 'Етично поведение'],
        },
        explanation:
          'Отлично решение! Етичното поведение е важно за дългосрочен успех.',
      },
      {
        text: 'Дарявате ги за благотворителност',
        impact: {
          balance: 0,
          savings: 0,
          happiness: 90,
          habits: ['Благотворителност', 'Социална отговорност'],
        },
        explanation:
          'Великолепно! Благотворителността е важна част от финансовата отговорност.',
      },
    ],
  },
];

const habits: Habit[] = [
  {
    id: 'saving',
    name: 'Спестяване',
    description: 'Регулярно отделяне на пари за бъдеще',
    icon: '💰',
    color: 'text-emerald-400',
  },
  {
    id: 'budgeting',
    name: 'Бюджетиране',
    description: 'Планиране на приходи и разходи',
    icon: '📊',
    color: 'text-blue-400',
  },
  {
    id: 'delayed',
    name: 'Отсрочено удовлетворение',
    description: 'Изчакване преди покупки',
    icon: '⏳',
    color: 'text-purple-400',
  },
  {
    id: 'comparison',
    name: 'Сравняване на цени',
    description: 'Търсене на най-добри оферти',
    icon: '🔍',
    color: 'text-amber-400',
  },
  {
    id: 'impulse',
    name: 'Импулсивно харчене',
    description: 'Покупки без предварително планиране',
    icon: '⚡',
    color: 'text-rose-400',
  },
];

const tutorials: Tutorial[] = [
  {
    id: 1,
    title: 'Основи на финансите',
    description: 'Научете основните принципи на паричното обращение',
    icon: <FaBook className="text-2xl" />,
    color: 'text-blue-400',
    content:
      'Парите са средство за размяна и съхранение на стойност. Важно е да разберете как те работят в икономиката.',
    examples: [
      'Как парите се движат в икономиката',
      'Защо е важно да спестяваме',
      'Как да управляваме разходите',
    ],
  },
  {
    id: 2,
    title: 'Бюджетиране',
    description: 'Научете как да планирате разходите си',
    icon: <FaCalculator className="text-2xl" />,
    color: 'text-green-400',
    content:
      'Бюджетирането е ключов инструмент за финансов успех. Научете как да разпределяте парите си разумно.',
    examples: [
      'Правило 50/30/20',
      'Как да проследявате разходите',
      'Как да постигнете финансови цели',
    ],
  },
  {
    id: 3,
    title: 'Инвестиране',
    description: 'Разберете основите на инвестирането',
    icon: <FaChartBar className="text-2xl" />,
    color: 'text-purple-400',
    content:
      'Инвестирането е начин да нарастите парите си с времето. Важно е да разберете рисковете и възможностите.',
    examples: [
      'Видове инвестиции',
      'Как да оценявате риска',
      'Дългосрочно планиране',
    ],
  },
];

const FinancialEducation = () => {
  const { isDarkMode } = useTheme();
  const [showTutorial, setShowTutorial] = useState(true);
  const [currentTutorial, setCurrentTutorial] = useState(0);
  const [currentScenario, setCurrentScenario] = useState<Scenario>(
    scenarios[0],
  );
  const [stats, setStats] = useState({
    balance: 100,
    savings: 0,
    happiness: 50,
    history: [] as { balance: number; savings: number; happiness: number }[],
    habits: new Set<string>(),
    achievements: new Set<string>(),
  });
  const [showExplanation, setShowExplanation] = useState(false);
  const [currentExplanation, setCurrentExplanation] = useState('');
  const [showAchievement, setShowAchievement] = useState(false);
  const [currentAchievement, setCurrentAchievement] = useState('');

  const handleOptionSelect = (option: Scenario['options'][0]) => {
    setCurrentExplanation(option.explanation);
    setShowExplanation(true);

    setStats((prev) => {
      const newStats = {
        balance: Math.max(0, prev.balance + option.impact.balance),
        savings: Math.max(0, prev.savings + option.impact.savings),
        happiness: Math.max(
          0,
          Math.min(100, prev.happiness + option.impact.happiness),
        ),
        history: [
          ...prev.history,
          {
            balance: prev.balance + option.impact.balance,
            savings: prev.savings + option.impact.savings,
            happiness: prev.happiness + option.impact.happiness,
          },
        ],
        habits: new Set([...prev.habits, ...option.impact.habits]),
        achievements: prev.achievements,
      };
      return newStats;
    });

    setTimeout(() => {
      setShowExplanation(false);
      const currentIndex = scenarios.findIndex(
        (s) => s.id === currentScenario.id,
      );
      if (currentIndex < scenarios.length - 1) {
        setCurrentScenario(scenarios[currentIndex + 1]);
      }
    }, 3000);
  };

  const nextTutorial = () => {
    if (currentTutorial < tutorials.length - 1) {
      setCurrentTutorial((prev) => prev + 1);
    } else {
      setShowTutorial(false);
    }
  };

  const prevTutorial = () => {
    if (currentTutorial > 0) {
      setCurrentTutorial((prev) => prev - 1);
    }
  };

  const checkAchievements = (newHabits: Set<string>) => {
    const achievements = [
      {
        id: 'saver',
        name: 'Спестявач',
        description: 'Придобихте 5 финансови навика',
        condition: newHabits.size >= 5,
      },
      {
        id: 'investor',
        name: 'Инвеститор',
        description: 'Достигнахте 500 лв. спестявания',
        condition: stats.savings >= 500,
      },
      {
        id: 'balanced',
        name: 'Балансиран',
        description: 'Поддържате добър баланс между спестявания и удоволствия',
        condition: stats.happiness >= 70 && stats.savings >= 200,
      },
    ];

    achievements.forEach((achievement) => {
      if (achievement.condition && !stats.achievements.has(achievement.id)) {
        setCurrentAchievement(achievement.name);
        setShowAchievement(true);
        setStats((prev) => ({
          ...prev,
          achievements: new Set([...prev.achievements, achievement.id]),
        }));
      }
    });
  };

  const chartOptions = {
    chart: {
      type: 'line' as const,
      background: 'transparent',
      toolbar: { show: false },
      animations: {
        enabled: true,
        easing: 'easeinout' as const,
        speed: 800,
        animateGradually: {
          enabled: true,
          delay: 150,
        },
        dynamicAnimation: {
          enabled: true,
          speed: 350,
        },
      },
    },
    stroke: {
      curve: 'smooth' as const,
      width: 3,
    },
    markers: {
      size: 6,
      strokeWidth: 3,
      strokeColors: '#fff',
      strokeDashArray: 0,
      hover: {
        size: 8,
      },
    },
    xaxis: {
      categories: stats.history.map((_, i) => `Сценарий ${i + 1}`),
      labels: {
        style: {
          colors: isDarkMode ? '#E2E8F0' : '#334155',
        },
      },
    },
    yaxis: {
      labels: {
        formatter: (value: number) => `${value.toFixed(0)}`,
        style: {
          colors: isDarkMode ? '#E2E8F0' : '#334155',
        },
      },
    },
    colors: ['#10B981', '#3B82F6', '#F59E0B'],
    legend: {
      position: 'bottom' as const,
      labels: {
        colors: isDarkMode ? '#E2E8F0' : '#334155',
      },
    },
    tooltip: {
      theme: isDarkMode ? 'dark' : 'light',
      y: {
        formatter: (value: number) => `${value.toFixed(2)} лв.`,
      },
      custom: function ({ series, seriesIndex, dataPointIndex, w }: any) {
        const currentValue = series[seriesIndex][dataPointIndex];
        const prevValue =
          dataPointIndex > 0 ? series[seriesIndex][dataPointIndex - 1] : null;
        const change = prevValue
          ? (((currentValue - prevValue) / prevValue) * 100).toFixed(1)
          : null;
        const changeNum = change ? parseFloat(change) : 0;

        return `
          <div class="p-2">
            <div class="font-semibold">${
              w.globals.seriesNames[seriesIndex]
            }</div>
            <div>Текуща стойност: ${currentValue.toFixed(2)} лв.</div>
            ${
              change
                ? `<div class="${
                    changeNum >= 0 ? 'text-green-500' : 'text-red-500'
                  }">
              Промяна: ${change}%
            </div>`
                : ''
            }
          </div>
        `;
      },
    },
  };

  const chartSeries = [
    {
      name: 'Баланс',
      data: stats.history.map((h) => h.balance),
    },
    {
      name: 'Спестявания',
      data: stats.history.map((h) => h.savings),
    },
    {
      name: 'Щастие',
      data: stats.history.map((h) => h.happiness),
    },
  ];

  return (
    <div
      className={`min-h-screen ${
        isDarkMode
          ? 'bg-gradient-to-br from-slate-900 via-gray-800 to-slate-900'
          : 'bg-gradient-to-br from-rose-50 via-sky-50 to-teal-50'
      }`}
    >
      <SideMenu />
      <div className="ml-64">
        <header
          className={`fixed top-0 right-0 left-64 z-10 ${
            isDarkMode ? 'bg-slate-800/95' : 'bg-white/95'
          } backdrop-blur-sm shadow-sm px-8 py-4`}
        >
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <h1
                className={`text-2xl font-bold ${
                  isDarkMode ? 'text-white' : 'text-slate-800'
                }`}
              >
                Финансов Симулатор
              </h1>
              <ThemeToggle />
            </div>
            {!showTutorial && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={() => setShowTutorial(true)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                  isDarkMode
                    ? 'bg-slate-700 hover:bg-slate-600'
                    : 'bg-slate-100 hover:bg-slate-200'
                }`}
              >
                <FaGraduationCap className="text-violet-400" />
                <span>Уроци</span>
              </motion.button>
            )}
          </div>
        </header>

        <main className="pt-20 px-8 pb-8">
          {showTutorial ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-6 rounded-lg ${
                isDarkMode ? 'bg-slate-800/50' : 'bg-white/50'
              } backdrop-blur-sm shadow-sm`}
            >
              <div className="flex items-center gap-3 mb-4">
                {tutorials[currentTutorial].icon}
                <h2 className="text-xl font-bold">
                  {tutorials[currentTutorial].title}
                </h2>
              </div>
              <p
                className={`mb-4 ${
                  isDarkMode ? 'text-slate-300' : 'text-slate-600'
                }`}
              >
                {tutorials[currentTutorial].description}
              </p>
              <div className="space-y-4">
                <p className={isDarkMode ? 'text-slate-300' : 'text-slate-600'}>
                  {tutorials[currentTutorial].content}
                </p>
                <ul className="list-disc list-inside space-y-2">
                  {tutorials[currentTutorial].examples.map((example, index) => (
                    <li
                      key={index}
                      className={
                        isDarkMode ? 'text-slate-300' : 'text-slate-600'
                      }
                    >
                      {example}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex justify-between mt-6">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={prevTutorial}
                  disabled={currentTutorial === 0}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                    currentTutorial === 0 ? 'opacity-50 cursor-not-allowed' : ''
                  } ${
                    isDarkMode
                      ? 'bg-slate-700 hover:bg-slate-600'
                      : 'bg-slate-100 hover:bg-slate-200'
                  }`}
                >
                  <FaArrowLeft />
                  <span>Предишен</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={nextTutorial}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                    isDarkMode
                      ? 'bg-violet-600 hover:bg-violet-700'
                      : 'bg-violet-500 hover:bg-violet-600'
                  } text-white`}
                >
                  <span>
                    {currentTutorial === tutorials.length - 1
                      ? 'Започни'
                      : 'Следващ'}
                  </span>
                  <FaArrowRight />
                </motion.button>
              </div>
            </motion.div>
          ) : (
            <>
              {/* Статистика */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-6 rounded-lg ${
                    isDarkMode ? 'bg-slate-800/50' : 'bg-white/50'
                  } backdrop-blur-sm shadow-sm`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <FaChartLine className="text-emerald-400 text-xl" />
                    <h3 className="text-lg font-semibold">Баланс</h3>
                  </div>
                  <p
                    className={`text-2xl font-bold ${
                      stats.balance >= 0 ? 'text-emerald-400' : 'text-rose-400'
                    }`}
                  >
                    {stats.balance.toFixed(2)} лв.
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className={`p-6 rounded-lg ${
                    isDarkMode ? 'bg-slate-800/50' : 'bg-white/50'
                  } backdrop-blur-sm shadow-sm`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <FaPiggyBank className="text-sky-400 text-xl" />
                    <h3 className="text-lg font-semibold">Спестявания</h3>
                  </div>
                  <p className="text-2xl font-bold text-sky-400">
                    {stats.savings.toFixed(2)} лв.
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className={`p-6 rounded-lg ${
                    isDarkMode ? 'bg-slate-800/50' : 'bg-white/50'
                  } backdrop-blur-sm shadow-sm`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <FaSmile className="text-amber-400 text-xl" />
                    <h3 className="text-lg font-semibold">Щастие</h3>
                  </div>
                  <p className="text-2xl font-bold text-amber-400">
                    {stats.happiness}%
                  </p>
                </motion.div>
              </div>

              {/* Текущ сценарий */}
              <motion.div
                key={currentScenario.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className={`p-6 rounded-lg ${
                  isDarkMode ? 'bg-slate-800/50' : 'bg-white/50'
                } backdrop-blur-sm shadow-sm mb-8`}
              >
                <div className="flex items-center gap-3 mb-4">
                  <FaLightbulb className="text-violet-400 text-2xl" />
                  <h2 className="text-xl font-bold">{currentScenario.title}</h2>
                </div>
                <p
                  className={`mb-6 ${
                    isDarkMode ? 'text-slate-300' : 'text-slate-600'
                  }`}
                >
                  {currentScenario.description}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {currentScenario.options.map((option, index) => (
                    <motion.button
                      key={index}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleOptionSelect(option)}
                      className={`p-4 rounded-lg text-left transition-all duration-200 ${
                        isDarkMode
                          ? 'bg-slate-700/50 hover:bg-slate-600/50'
                          : 'bg-slate-50/50 hover:bg-slate-100/50'
                      }`}
                    >
                      {option.text}
                    </motion.button>
                  ))}
                </div>
              </motion.div>

              {/* Обяснение */}
              {showExplanation && (
                <motion.div
                  key="explanation"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={`p-4 rounded-lg mb-8 ${
                    isDarkMode ? 'bg-slate-700/50' : 'bg-slate-100/50'
                  } backdrop-blur-sm shadow-sm`}
                >
                  <div className="flex items-center gap-2">
                    <FaCheckCircle className="text-emerald-400" />
                    <p
                      className={
                        isDarkMode ? 'text-slate-300' : 'text-slate-600'
                      }
                    >
                      {currentExplanation}
                    </p>
                  </div>
                </motion.div>
              )}

              {/* Финансови навици */}
              <div
                className={`p-6 rounded-lg ${
                  isDarkMode ? 'bg-slate-800/50' : 'bg-white/50'
                } backdrop-blur-sm shadow-sm mb-8`}
              >
                <h2 className="text-xl font-bold mb-4">
                  Вашите финансови навици
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {habits.map((habit) => (
                    <motion.div
                      key={habit.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className={`p-4 rounded-lg ${
                        isDarkMode ? 'bg-slate-700/50' : 'bg-slate-50/50'
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl">{habit.icon}</span>
                        <h3 className={`font-medium ${habit.color}`}>
                          {habit.name}
                        </h3>
                      </div>
                      <p className="text-sm mb-2">{habit.description}</p>
                      <div className="flex items-center gap-2">
                        {stats.habits.has(habit.name) ? (
                          <FaCheckCircle className="text-emerald-400" />
                        ) : (
                          <FaTimesCircle className="text-rose-400" />
                        )}
                        <span className="text-sm">
                          {stats.habits.has(habit.name)
                            ? 'Придобит'
                            : 'Не придобит'}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Графика */}
              {stats.history.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-6 rounded-lg ${
                    isDarkMode ? 'bg-slate-800/50' : 'bg-white/50'
                  } backdrop-blur-sm shadow-sm`}
                >
                  <h2 className="text-xl font-bold mb-4">
                    Вашият финансов път
                  </h2>
                  <ApexCharts
                    options={chartOptions}
                    series={chartSeries}
                    type="line"
                    height={350}
                  />
                </motion.div>
              )}

              {/* Achievement notification */}
              {showAchievement && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={`fixed top-24 right-8 p-4 rounded-lg ${
                    isDarkMode ? 'bg-slate-800' : 'bg-white'
                  } shadow-lg z-50`}
                >
                  <div className="flex items-center gap-3">
                    <FaTrophy className="text-amber-400 text-2xl" />
                    <div>
                      <h3 className="font-bold">Постижение отключено!</h3>
                      <p>{currentAchievement}</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </>
          )}
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default FinancialEducation;
