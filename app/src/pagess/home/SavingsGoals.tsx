import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import ThemeToggle from '../../components/ThemeToggle';
import ApexCharts from 'react-apexcharts';
import SideMenu from '../../components/SideMenu';
import Footer from '../../components/Footerr/Footer';
import { generateAIAnalysis } from './helper-functions';

interface Milestone {
  date: string;
  targetAmount: number;
  description: string;
  isCompleted: boolean;
}

interface AIAnalysis {
  mainPlan: {
    monthlyTarget: number;
    timeline: string;
    steps: string[];
  };
  alternativeMethods: {
    suggestions: string[];
    expectedResults: string;
  };
  progressTracking: {
    milestones: Milestone[];
  };
}

interface SavingsGoal {
  id: number;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  description: string;
  monthlyIncome: string;
  milestones: Milestone[];
  aiAnalysis?: AIAnalysis;
}

const incomeRanges = [
  '0-500 лв.',
  '501-1000 лв.',
  '1001-1500 лв.',
  '1501-2000 лв.',
  'над 2000 лв.',
];

const SavingsGoals = () => {
  const { isDarkMode } = useTheme();
  const [goals, setGoals] = useState<SavingsGoal[]>([]);
  const [newGoal, setNewGoal] = useState({
    name: '',
    targetAmount: '',
    deadline: '',
    description: '',
    monthlyIncome: incomeRanges[0],
  });

  const generateAIAnalysis = async (goalData: any) => {
    try {
      const response = await fetch(
        'https://api.openai.com/v1/chat/completions',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${
              (import.meta as any).env.VITE_OPENAI_API_KEY
            }`,
          },
          body: JSON.stringify({
            model: 'gpt-4',
            messages: [
              {
                role: 'system',
                content: `Създай план за спестяване със следната структура:
                {
                  "mainPlan": {
                    "monthlyTarget": number,
                    "timeline": string,
                    "steps": string[]
                  },
                  "alternativeMethods": {
                    "suggestions": string[],
                    "expectedResults": string
                  }
                }`,
              },
              {
                role: 'user',
                content: `Анализирай тази цел: ${JSON.stringify(goalData)}`,
              },
            ],
          }),
        },
      );

      if (!response.ok) {
        throw new Error('AI API Error');
      }

      const data = await response.json();
      return JSON.parse(data.choices[0].message.content);
    } catch (error) {
      console.error('AI Analysis Error:', error);
      return {
        mainPlan: {
          monthlyTarget: parseFloat(goalData.targetAmount) / 6,
          timeline: '6-месечен план',
          steps: ['Стъпка 1', 'Стъпка 2', 'Стъпка 3'],
        },
        alternativeMethods: {
          suggestions: ['Метод 1', 'Метод 2'],
          expectedResults: 'Очаквани резултати',
        },
      };
    }
  };
  const calculateMilestones = (
    targetAmount: number,
    deadline: string,
  ): Milestone[] => {
    const totalDays = getRemainingDays(deadline);
    const milestones: Milestone[] = [];
    const intervals = 4;

    for (let i = 1; i <= intervals; i++) {
      const daysFromNow = Math.floor((totalDays / intervals) * i);
      const targetDate = new Date();
      targetDate.setDate(targetDate.getDate() + daysFromNow);

      milestones.push({
        date: targetDate.toISOString().split('T')[0],
        targetAmount: (targetAmount / intervals) * i,
        description: `Междинна цел ${i}`,
        isCompleted: false,
      });
    }

    return milestones;
  };

  const handleAddGoal = async () => {
    if (!newGoal.name || !newGoal.targetAmount || !newGoal.deadline) return;

    const targetAmount = parseFloat(newGoal.targetAmount);
    const milestones = calculateMilestones(targetAmount, newGoal.deadline);

    const analysis = await generateAIAnalysis(newGoal);

    const goalToAdd = {
      id: goals.length + 1,
      ...newGoal,
      targetAmount,
      currentAmount: 0,
      milestones,
      aiAnalysis: analysis,
    };

    setGoals((prevGoals) => [...prevGoals, goalToAdd]);
    setNewGoal({
      name: '',
      targetAmount: '',
      deadline: '',
      description: '',
      monthlyIncome: incomeRanges[0],
    });
  };
  const calculateProgress = (goal: SavingsGoal) => {
    return (goal.currentAmount / goal.targetAmount) * 100;
  };

  const getRemainingDays = (deadline: string) => {
    const remaining = Math.ceil(
      (new Date(deadline).getTime() - new Date().getTime()) /
        (1000 * 60 * 60 * 24),
    );
    return remaining > 0 ? remaining : 0;
  };

  const updateMilestoneProgress = (goalId: number, milestoneIndex: number) => {
    setGoals((prevGoals) =>
      prevGoals.map((goal) => {
        if (goal.id === goalId) {
          const updatedMilestones = [...goal.milestones];
          updatedMilestones[milestoneIndex].isCompleted = true;
          return { ...goal, milestones: updatedMilestones };
        }
        return goal;
      }),
    );
  };

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
        <div className="max-w-7xl mx-auto">
          <header
            className={`fixed top-0 right-0 left-64 z-10 ${
              isDarkMode ? 'bg-slate-800/95' : 'bg-white/95'
            } backdrop-blur-sm shadow-sm px-8 py-4`}
          >
            <div className="flex items-center gap-4">
              <h1
                className={`text-2xl font-bold ${
                  isDarkMode ? 'text-white' : 'text-slate-800'
                }`}
              >
                Цели за спестяване
              </h1>
              <ThemeToggle />
            </div>
          </header>

          <main className="pt-20 px-8 pb-8">
            <div
              className={`mb-8 p-6 rounded-xl ${
                isDarkMode ? 'bg-slate-800/50' : 'bg-white/50'
              } backdrop-blur-sm shadow-sm`}
            >
              <h2
                className={`text-3xl font-bold mb-4 ${
                  isDarkMode ? 'text-white' : 'text-slate-800'
                }`}
              >
                Дългосрочно планиране
              </h2>
              <p className={isDarkMode ? 'text-slate-300' : 'text-slate-600'}>
                Тук можеш да зададеш своите дългосрочни финансови цели, да
                проследиш прогреса си и да получиш персонализиран план как да ги
                постигнеш.
              </p>
            </div>

            <div
              className={`mb-8 p-6 rounded-xl ${
                isDarkMode ? 'bg-slate-800/50' : 'bg-white/50'
              } backdrop-blur-sm shadow-sm`}
            >
              <h2 className="text-xl font-bold mb-4">Добави нова цел</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <input
                  type="text"
                  value={newGoal.name}
                  onChange={(e) =>
                    setNewGoal({ ...newGoal, name: e.target.value })
                  }
                  placeholder="Име на целта"
                  className={`p-2 rounded-md ${
                    isDarkMode
                      ? 'bg-slate-700 text-white'
                      : 'bg-white text-slate-900'
                  } border border-slate-300 focus:ring-2 focus:ring-sky-300`}
                />
                <input
                  type="number"
                  value={newGoal.targetAmount}
                  onChange={(e) =>
                    setNewGoal({ ...newGoal, targetAmount: e.target.value })
                  }
                  placeholder="Целева сума"
                  className={`p-2 rounded-md ${
                    isDarkMode
                      ? 'bg-slate-700 text-white'
                      : 'bg-white text-slate-900'
                  } border border-slate-300 focus:ring-2 focus:ring-sky-300`}
                />
                <input
                  type="date"
                  value={newGoal.deadline}
                  onChange={(e) =>
                    setNewGoal({ ...newGoal, deadline: e.target.value })
                  }
                  className={`p-2 rounded-md ${
                    isDarkMode
                      ? 'bg-slate-700 text-white'
                      : 'bg-white text-slate-900'
                  } border border-slate-300 focus:ring-2 focus:ring-sky-300`}
                />
                <select
                  value={newGoal.monthlyIncome}
                  onChange={(e) =>
                    setNewGoal({ ...newGoal, monthlyIncome: e.target.value })
                  }
                  className={`p-2 rounded-md ${
                    isDarkMode
                      ? 'bg-slate-700 text-white'
                      : 'bg-white text-slate-900'
                  } border border-slate-300 focus:ring-2 focus:ring-sky-300`}
                >
                  {incomeRanges.map((range) => (
                    <option key={range} value={range}>
                      {range}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  value={newGoal.description}
                  onChange={(e) =>
                    setNewGoal({ ...newGoal, description: e.target.value })
                  }
                  placeholder="Описание"
                  className={`p-2 rounded-md ${
                    isDarkMode
                      ? 'bg-slate-700 text-white'
                      : 'bg-white text-slate-900'
                  } border border-slate-300 focus:ring-2 focus:ring-sky-300`}
                />
              </div>
              <button
                onClick={handleAddGoal}
                className={`mt-4 px-6 py-2 rounded-md ${
                  isDarkMode
                    ? 'bg-sky-500/90 hover:bg-sky-600/90'
                    : 'bg-sky-400/90 hover:bg-sky-500/90'
                } text-white transition-all duration-200`}
              >
                Добави цел
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {goals.map((goal) => (
                <div
                  key={goal.id}
                  className={`p-6 rounded-xl ${
                    isDarkMode ? 'bg-slate-800/50' : 'bg-white/50'
                  } backdrop-blur-sm shadow-sm`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold mb-2">{goal.name}</h3>
                      <p
                        className={
                          isDarkMode ? 'text-slate-400' : 'text-slate-600'
                        }
                      >
                        {goal.description}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold text-sky-400">
                        {goal.currentAmount.toFixed(2)} /{' '}
                        {goal.targetAmount.toFixed(2)} лв.
                      </p>
                      <p
                        className={`text-sm ${
                          isDarkMode ? 'text-slate-400' : 'text-slate-600'
                        }`}
                      >
                        Остават {getRemainingDays(goal.deadline)} дни
                      </p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-sky-400 transition-all duration-300"
                        style={{ width: `${calculateProgress(goal)}%` }}
                      />
                    </div>
                  </div>

                  {goal.aiAnalysis && (
                    <div
                      className={`mt-4 p-4 rounded-lg ${
                        isDarkMode ? 'bg-slate-700/50' : 'bg-slate-50/50'
                      }`}
                    >
                      <h4 className="font-semibold mb-4">
                        AI План за спестяване
                      </h4>

                      <div className="space-y-4">
                        <div>
                          <h5 className="font-medium mb-2">Основен план</h5>
                          <p className="text-lg mb-2">
                            Месечна цел:{' '}
                            <span className="text-sky-400 font-semibold">
                              {goal.aiAnalysis.mainPlan.monthlyTarget.toFixed(
                                2,
                              )}{' '}
                              лв.
                            </span>
                          </p>
                          <p className="mb-2">
                            {goal.aiAnalysis.mainPlan.timeline}
                          </p>
                          <ul className="space-y-1">
                            {goal.aiAnalysis.mainPlan.steps.map(
                              (step, index) => (
                                <li
                                  key={index}
                                  className="flex items-start gap-2"
                                >
                                  <span className="text-sky-400">•</span>
                                  <span>{step}</span>
                                </li>
                              ),
                            )}
                          </ul>
                        </div>

                        <div>
                          <h5 className="font-medium mb-2">Междинни цели</h5>
                          <div className="space-y-2">
                            {goal.milestones.map((milestone, index) => (
                              <div
                                key={index}
                                className="flex items-center gap-2"
                              >
                                <input
                                  type="checkbox"
                                  checked={milestone.isCompleted}
                                  onChange={() =>
                                    updateMilestoneProgress(goal.id, index)
                                  }
                                  className="rounded text-sky-400"
                                />
                                <span>
                                  {milestone.description}:{' '}
                                  {milestone.targetAmount.toFixed(2)} лв. до{' '}
                                  {new Date(milestone.date).toLocaleDateString(
                                    'bg-BG',
                                  )}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h5 className="font-medium mb-2">
                            Алтернативни методи
                          </h5>
                          <ul className="space-y-1">
                            {goal.aiAnalysis.alternativeMethods.suggestions.map(
                              (suggestion, index) => (
                                <li
                                  key={index}
                                  className="flex items-start gap-2"
                                >
                                  <span className="text-sky-400">•</span>
                                  <span>{suggestion}</span>
                                </li>
                              ),
                            )}
                          </ul>
                          <p className="mt-2 text-sm text-sky-400">
                            {goal.aiAnalysis.alternativeMethods.expectedResults}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </main>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default SavingsGoals;
