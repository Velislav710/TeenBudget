import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  progressTracking?: {
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
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const [goals, setGoals] = useState<SavingsGoal[]>([]);
  const [newGoal, setNewGoal] = useState({
    name: '',
    targetAmount: '',
    deadline: '',
    description: '',
    monthlyIncome: incomeRanges[0],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Зареждане на целите от localStorage при първоначално зареждане
  useEffect(() => {
    const savedGoals = localStorage.getItem('savingsGoals');
    if (savedGoals) {
      setGoals(JSON.parse(savedGoals));
    }
  }, []);

  // Зареждане на целите от API
  useEffect(() => {
    const loadGoals = async () => {
      try {
        const token =
          localStorage.getItem('authToken') ||
          sessionStorage.getItem('authToken');
        if (!token) return;

        const response = await fetch(
          `${(import.meta as any).env.VITE_API_BASE_URL}/savings-goals`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (response.ok) {
          const data = await response.json();
          if (data.goals && data.goals.length > 0) {
            setGoals(data.goals);
          }
        }
      } catch (error) {
        console.error('Error loading goals:', error);
      }
    };

    loadGoals();
  }, []);

  // Запазване на целите в localStorage при промяна
  useEffect(() => {
    if (goals.length > 0) {
      localStorage.setItem('savingsGoals', JSON.stringify(goals));
    }
  }, [goals]);

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
    if (!newGoal.name || !newGoal.targetAmount || !newGoal.deadline) {
      setError('Моля, попълнете всички задължителни полета');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const targetAmount = parseFloat(newGoal.targetAmount);
      const milestones = calculateMilestones(targetAmount, newGoal.deadline);

      // Извличане на числовата стойност от месечния доход
      const incomeRange = newGoal.monthlyIncome;
      let monthlyIncome = 0;

      if (incomeRange === 'над 2000 лв.') {
        monthlyIncome = 2500;
      } else {
        const range = incomeRange.split('-');
        if (range.length === 2) {
          const min = parseInt(range[0]);
          const max = parseInt(range[1].replace(' лв.', ''));
          monthlyIncome = (min + max) / 2;
        }
      }

      // Извикване на AI анализа
      const analysis = await generateAIAnalysis({
        name: newGoal.name,
        targetAmount,
        deadline: newGoal.deadline,
        monthlyIncome,
      });

      // Изпращане на данните към API
      const token =
        localStorage.getItem('authToken') ||
        sessionStorage.getItem('authToken');

      try {
        const response = await fetch(
          `${(import.meta as any).env.VITE_API_BASE_URL}/savings-goals`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              name: newGoal.name,
              targetAmount,
              currentAmount: 0,
              deadline: newGoal.deadline,
              description: newGoal.description,
              monthlyIncome: newGoal.monthlyIncome,
              milestones,
              aiAnalysis: analysis,
            }),
          },
        );

        const data = await response.json();

        if (!response.ok) {
          console.error('API Error:', data);
          setError(data.error || 'Грешка при запазване на целта');
          return;
        }

        console.log('Goal saved to database successfully!');

        const goalToAdd = {
          id: data.goal.id,
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
      } catch (error) {
        console.error('Error saving goal to database:', error);
        setError(
          'Възникна грешка при запазването на целта. Моля, опитайте отново.',
        );
      }
    } catch (err) {
      setError(
        'Възникна грешка при създаването на целта. Моля, опитайте отново.',
      );
      console.error(err);
    } finally {
      setIsLoading(false);
    }
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
          updatedMilestones[milestoneIndex].isCompleted =
            !updatedMilestones[milestoneIndex].isCompleted;

          // Ако отбелязваме като завършена, увеличаваме текущата сума
          if (updatedMilestones[milestoneIndex].isCompleted) {
            return {
              ...goal,
              milestones: updatedMilestones,
              currentAmount: updatedMilestones[milestoneIndex].targetAmount,
            };
          }

          // Ако размаркираме, намираме предишната завършена цел
          const previousCompleted = updatedMilestones
            .slice(0, milestoneIndex)
            .filter((m) => m.isCompleted)
            .pop();

          return {
            ...goal,
            milestones: updatedMilestones,
            currentAmount: previousCompleted
              ? previousCompleted.targetAmount
              : 0,
          };
        }
        return goal;
      }),
    );
  };

  const deleteGoal = (goalId: number) => {
    setGoals((prevGoals) => prevGoals.filter((goal) => goal.id !== goalId));
  };

  const updateGoalAmount = (goalId: number, amount: number) => {
    setGoals((prevGoals) =>
      prevGoals.map((goal) =>
        goal.id === goalId
          ? { ...goal, currentAmount: Math.min(amount, goal.targetAmount) }
          : goal,
      ),
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
                постигнеш с помощта на изкуствен интелект.
              </p>
            </div>

            <div
              className={`mb-8 p-6 rounded-xl ${
                isDarkMode ? 'bg-slate-800/50' : 'bg-white/50'
              } backdrop-blur-sm shadow-sm`}
            >
              <h2 className="text-xl font-bold mb-4">Добави нова цел</h2>
              {error && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
                  {error}
                </div>
              )}
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
                disabled={isLoading}
                className={`mt-4 px-6 py-2 rounded-md ${
                  isDarkMode
                    ? 'bg-sky-500/90 hover:bg-sky-600/90'
                    : 'bg-sky-400/90 hover:bg-sky-500/90'
                } text-white transition-all duration-200 ${
                  isLoading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isLoading ? 'Създаване...' : 'Добави цел'}
              </button>
            </div>

            {goals.length === 0 ? (
              <div
                className={`p-12 text-center rounded-xl ${
                  isDarkMode ? 'bg-slate-800/50' : 'bg-white/50'
                } backdrop-blur-sm shadow-sm`}
              >
                <p
                  className={`text-lg ${
                    isDarkMode ? 'text-slate-300' : 'text-slate-600'
                  }`}
                >
                  Все още нямате добавени цели за спестяване.
                </p>
                <p
                  className={`mt-2 ${
                    isDarkMode ? 'text-slate-400' : 'text-slate-500'
                  }`}
                >
                  Добавете първата си цел, за да получите персонализиран план за
                  спестяване!
                </p>
              </div>
            ) : (
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
                          {(goal.currentAmount || 0).toFixed(2)} /{' '}
                          {(goal.targetAmount || 0).toFixed(2)} лв.
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

                    <div className="flex gap-2 mb-4">
                      <input
                        type="number"
                        placeholder="Добави сума"
                        className={`p-2 rounded-md ${
                          isDarkMode
                            ? 'bg-slate-700 text-white'
                            : 'bg-white text-slate-900'
                        } border border-slate-300 focus:ring-2 focus:ring-sky-300`}
                        onChange={(e) => {
                          const value = parseFloat(e.target.value);
                          if (!isNaN(value) && value >= 0) {
                            updateGoalAmount(goal.id, value);
                          }
                        }}
                      />
                      <button
                        onClick={() => deleteGoal(goal.id)}
                        className="px-3 py-2 rounded-md bg-red-500/80 hover:bg-red-600/80 text-white transition-all duration-200"
                      >
                        Изтрий
                      </button>
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
                                    {new Date(
                                      milestone.date,
                                    ).toLocaleDateString('bg-BG')}
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
                              {
                                goal.aiAnalysis.alternativeMethods
                                  .expectedResults
                              }
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </main>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default SavingsGoals;
