import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../../components/Footerr/Footer';
import { useTheme } from '../../context/ThemeContext';
import ThemeToggle from '../../components/ThemeToggle';
import {
  FaBullhorn,
  FaChartLine,
  FaDollarSign,
  FaHandsHelping,
  FaRegLightbulb,
} from 'react-icons/fa';
const FaviconIcon = '/favicon.png';
const WelcomePage = () => {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const [selectedFeature, setSelectedFeature] = useState(0);
  const features = [
    {
      title: 'Управление на разходите',
      description: (
        <div>
          <p>
            Спести време и усилия, като платформата автоматично разпознава
            твоите разходи и ги групира по категории. Това ще ти помогне да имаш
            ясна представа за какво харчиш и да оптимизираш разходите си.
          </p>
          <p>
            Пример: Ако похарчиш 50 лева в магазин за храна, платформата
            автоматично ще ги постави в категорията "Храна". Така можеш да
            следиш колко харчиш за всеки вид разходи.
          </p>
        </div>
      ),
      icon: <FaChartLine className="text-emerald-400" />,
    },
    {
      title: 'Интелигентни препоръки',
      description: (
        <div>
          <p>
            Нашият алгоритъм предлага персонализирани финансови съвети и
            стратегии, основани на твоите разходи, спестявания и цели.
          </p>
          <p>
            Пример: Ако имаш високи разходи за кафе, платформата ще предложи
            алтернативи за спестяване, като например намаляване на броя на
            кафетата или преход към по-евтини опции.
          </p>
        </div>
      ),
      icon: <FaDollarSign className="text-emerald-400" />,
    },
    {
      title: 'Цели на спестяването',
      description: (
        <div>
          <p>
            Задавай финансови цели и следи напредъка си. Определи колко искаш да
            спестиш за определен период и наблюдавай дали си на прав път.
          </p>
          <p>
            Пример: Ако искаш да спестиш 1000 лева за почивка след 6 месеца,
            платформата ще изчисли каква сума трябва да спестяваш всеки месец,
            за да постигнеш целта си.
          </p>
        </div>
      ),
      icon: <FaHandsHelping className="text-emerald-400" />,
    },
    {
      title: 'Прогнози за бъдещето',
      description: (
        <div>
          <p>
            Планирай финансовото си бъдеще с точни прогнози, които ще ти
            помогнат да вземеш по-добри решения. Платформата използва твоите
            данни, за да изготви прогнози за спестявания и разходи.
          </p>
          <p>
            Пример: Ако започнеш да спестяваш редовно, платформата ще ти покаже
            какви ще бъдат твоите финансови резултати след 1 година, ако следваш
            плана си.
          </p>
        </div>
      ),
      icon: <FaBullhorn className="text-emerald-400" />,
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
      <div className="max-w-7xl mx-auto px-4 py-8">
        <header
          className={`fixed top-0 right-0 left-0 z-10 ${
            isDarkMode ? 'bg-slate-800/95' : 'bg-white/95'
          } backdrop-blur-sm shadow-sm px-8 py-4`}
        >
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="flex items-center gap-4">
              {/* Добавяне на favicon като лого */}
              <img src={FaviconIcon} alt="Logo" className="h-18 w-18" />
              <h1
                className={`text-2xl font-bold ${
                  isDarkMode ? 'text-white' : 'text-slate-800'
                }`}
              >
                Тийн Бюджет
              </h1>
              <ThemeToggle />
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/signup')}
                className={`px-6 py-2 rounded-md ${
                  isDarkMode
                    ? 'bg-emerald-500/90 hover:bg-emerald-600/90'
                    : 'bg-emerald-400/90 hover:bg-emerald-500/90'
                } text-white transition-all duration-200`}
              >
                Създай Акаунт
              </button>
              <button
                onClick={() => navigate('/login')}
                className={`px-6 py-2 rounded-md ${
                  isDarkMode
                    ? 'bg-sky-500/90 hover:bg-sky-600/90'
                    : 'bg-sky-400/90 hover:bg-sky-500/90'
                } text-white transition-all duration-200`}
              >
                Вход
              </button>
            </div>
          </div>
        </header>

        <main className="pt-24">
          <div
            className={`p-8 rounded-2xl ${
              isDarkMode ? 'bg-slate-800/50' : 'bg-white/50'
            } backdrop-blur-sm shadow-sm mb-8`}
          >
            <h2
              className={`text-4xl font-bold mb-6 text-center ${
                isDarkMode ? 'text-white' : 'text-slate-800'
              }`}
            >
              Добре дошли в Тийн Бюджет!
            </h2>
            <p
              className={`text-xl text-center mb-8 ${
                isDarkMode ? 'text-slate-300' : 'text-slate-600'
              }`}
            >
              Управлявай бюджета си с лекота и започни да вземаш умни финансови
              решения още от сега!
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className={`p-6 rounded-xl ${
                    isDarkMode ? 'bg-slate-700/50' : 'bg-white/50'
                  } backdrop-blur-sm shadow-sm transition-all duration-300 hover:transform hover:scale-105`}
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="text-3xl">{feature.icon}</div>
                    <h3
                      className={`text-xl font-bold ${
                        isDarkMode ? 'text-white' : 'text-slate-800'
                      }`}
                    >
                      {feature.title}
                    </h3>
                  </div>
                  <div
                    className={`${
                      isDarkMode ? 'text-slate-300' : 'text-slate-600'
                    }`}
                  >
                    {feature.description}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <button
                onClick={() => navigate('/signup')}
                className={`px-8 py-4 rounded-xl text-lg font-bold ${
                  isDarkMode
                    ? 'bg-emerald-500/90 hover:bg-emerald-600/90'
                    : 'bg-emerald-400/90 hover:bg-emerald-500/90'
                } text-white transition-all duration-200 transform hover:scale-105`}
              >
                Започни сега
              </button>
              <button
                onClick={() => navigate('/login')}
                className={`px-8 py-4 rounded-xl text-lg font-bold ${
                  isDarkMode
                    ? 'bg-sky-500/90 hover:bg-sky-600/90'
                    : 'bg-sky-400/90 hover:bg-sky-500/90'
                } text-white transition-all duration-200 transform hover:scale-105`}
              >
                Влез в профила си
              </button>
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default WelcomePage;
