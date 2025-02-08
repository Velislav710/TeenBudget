import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import ThemeToggle from '../../components/ThemeToggle';
import SideMenu from '../../components/SideMenu';
import Footer from '../../components/Footerr/Footer';

const FinancialEducation = () => {
  const { isDarkMode } = useTheme();

  const concepts = [
    {
      title: 'Бюджетиране',
      description: 'Планиране на приходи и разходи',
      icon: '💰',
      examples: ['Месечен план за джобни', 'Спестяване за телефон'],
    },
    {
      title: 'Спестяване',
      description: 'Отделяне на пари за бъдещи цели',
      icon: '🏦',
      examples: ['10% правило', 'Спестовна сметка'],
    },
    {
      title: 'Инвестиране',
      description: 'Влагане на пари за бъдеща печалба',
      icon: '📈',
      examples: ['Спестовни влогове', 'Детски влог'],
    },
    {
      title: 'Разумно харчене',
      description: 'Вземане на умни решения за покупки',
      icon: '🛒',
      examples: ['Сравняване на цени', 'Изчакване на намаления'],
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
                Финансово образование
              </h1>
              <ThemeToggle />
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-8 py-8 pt-20">
          {/* Основни концепции */}
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
              Основни финансови концепции
            </h2>
            <p
              className={`${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}
            >
              Научи основните принципи на личните финанси по лесен и разбираем
              начин
            </p>
          </div>

          {/* Концепции грид */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {concepts.map((concept) => (
              <div
                key={concept.title}
                className={`p-6 rounded-xl ${
                  isDarkMode ? 'bg-slate-800/50' : 'bg-white/50'
                } backdrop-blur-sm shadow-sm`}
              >
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-4xl">{concept.icon}</span>
                  <h3 className="text-xl font-bold">{concept.title}</h3>
                </div>
                <p
                  className={`mb-4 ${
                    isDarkMode ? 'text-slate-300' : 'text-slate-600'
                  }`}
                >
                  {concept.description}
                </p>
                <div className="space-y-2">
                  <h4 className="font-medium">Примери:</h4>
                  <ul className="list-disc list-inside space-y-1">
                    {concept.examples.map((example, index) => (
                      <li key={index} className="text-sm">
                        {example}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          {/* Съвети за спестяване */}
          <div
            className={`mb-8 p-6 rounded-xl ${
              isDarkMode ? 'bg-slate-800/50' : 'bg-white/50'
            } backdrop-blur-sm shadow-sm`}
          >
            <h2 className="text-xl font-bold mb-6">Съвети за спестяване</h2>
            <div className="grid gap-4">
              <div
                className={`p-4 rounded-lg ${
                  isDarkMode ? 'bg-slate-700/50' : 'bg-slate-50/50'
                }`}
              >
                <h3 className="font-medium mb-2">Правило 50/30/20</h3>
                <p className="text-sm">
                  50% за нужди, 30% за желания, 20% за спестяване
                </p>
              </div>
              <div
                className={`p-4 rounded-lg ${
                  isDarkMode ? 'bg-slate-700/50' : 'bg-slate-50/50'
                }`}
              >
                <h3 className="font-medium mb-2">24-часово правило</h3>
                <p className="text-sm">Изчакай 24 часа преди големи покупки</p>
              </div>
              <div
                className={`p-4 rounded-lg ${
                  isDarkMode ? 'bg-slate-700/50' : 'bg-slate-50/50'
                }`}
              >
                <h3 className="font-medium mb-2">
                  Спестовни предизвикателства
                </h3>
                <p className="text-sm">
                  Започни с малки суми и увеличавай постепенно
                </p>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default FinancialEducation;
