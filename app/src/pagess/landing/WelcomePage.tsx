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
            Забрави за ръчното записване на разходи. Нашата платформа автоматично ще ги класифицира по категории, така че винаги да знаеш какво харчиш.
          </p>
          <p>
            Пример: Купил си храна за 50 лв.? Платформата автоматично ще го запише в категория "Храна", за да имаш пълен контрол.
          </p>
        </div>
      ),
      icon: <FaChartLine className="text-teal-500" />,
    },
    {
      title: 'Интелигентни препоръки',
      description: (
        <div>
          <p>
            Получавай персонализирани финансови съвети и стратегии, които ще ти помогнат да спестяваш повече и да управляваш по-добре парите си.
          </p>
          <p>
            Пример: Ако харчиш твърде много за кафе, платформата ще предложи начини за спестяване като намаляване на броя на кафетата или избора на по-евтини опции.
          </p>
        </div>
      ),
      icon: <FaDollarSign className="text-teal-500" />,
    },
    {
      title: 'Цели на спестяването',
      description: (
        <div>
          <p>
            Задай ясни финансови цели и проследявай напредъка си. Бъди сигурен, че няма да пропуснеш нито една стъпка към финансовата си стабилност.
          </p>
          <p>
            Пример: Ако искаш да спестиш за почивка през лятото, ние ще ти покажем как да постигнеш целта си стъпка по стъпка.
          </p>
        </div>
      ),
      icon: <FaHandsHelping className="text-teal-500" />,
    },
    {
      title: 'Прогнози за бъдещето',
      description: (
        <div>
          <p>
            Използвай нашите прогнози, за да видиш как ще изглеждат твоите разходи и спестявания през следващите месеци. Така можеш да правиш по-добри финансови решения.
          </p>
          <p>
            Пример: Ако започнеш да спестяваш редовно, ние ще ти покажем какво ще бъдат твоите финансови резултати след година.
          </p>
        </div>
      ),
      icon: <FaBullhorn className="text-teal-500" />,
    },
  ];

  return (
    <div className={isDarkMode ? 'dark' : ''}>
      <div
        className={`min-h-screen ${isDarkMode ? 'bg-gradient-to-br from-gray-800 via-gray-900 to-black text-white' : 'bg-gradient-to-br from-blue-200 via-blue-300 to-blue-400'} flex flex-col`}
      >
        {/* Превключвател за тъмна/светла тема */}
        <div className="fixed top-4 right-4 z-50">
          <ThemeToggle />
        </div>

        {/* Фиксиран хедър с логото и навигация */}
        <header
          className={`fixed top-0 left-0 w-full py-6 ${isDarkMode ? 'bg-gradient-to-r from-gray-800 to-gray-900' : 'bg-gradient-to-r from-blue-400 to-blue-500'} text-white shadow-md z-40`}
        >
          <div className="max-w-6xl mx-auto flex justify-between items-center">
            <h1 className="text-2xl font-bold">Тийн Бюджет</h1>
            <nav className="flex space-x-8">
              <button
                onClick={() => navigate('/signup')}
                className="text-white transition-colors duration-300"
              >
                Създай Акаунт
              </button>
              <button
                onClick={() => navigate('/login')}
                className="text-white transition-colors duration-300"
              >
                Вход
              </button>
            </nav>
          </div>
        </header>

        {/* Основен контейнер за съдържание */}
        <div className="flex-grow flex items-center justify-center p-8 pt-24">
          <div
            className={`max-w-5xl mx-auto text-center ${isDarkMode ? 'bg-gray-800/90' : 'bg-white/90'} rounded-3xl p-14 shadow-lg backdrop-blur-lg`}
          >
            <header className="mb-12">
              <h1
                className={`text-4xl font-extrabold mb-4 ${isDarkMode ? 'text-white' : 'text-teal-900'} transition-all duration-300`}
              >
                Добре дошъл в Тийн Бюджет! Твоят личен финансов помощник за умно управление на парите!
              </h1>
              <p
                className={`text-xl ${isDarkMode ? 'text-gray-300' : 'text-teal-900'} max-w-3xl mx-auto`}
              >
                Управлявай бюджета си с лекота и започни да вземаш умни финансови решения още от сега! <strong>Това е правилният избор за твоето финансово бъдеще!</strong>
              </p>
            </header>

            {/* Интерактивни предимства със слайдер */}
            <section className="mb-16">
              <h2
                className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-teal-900'} mb-4 flex items-center justify-center`}
              >
                <FaBullhorn className="mr-4 text-4xl" />
                Защо е правилният избор?
              </h2>
              <div className="flex space-x-4 justify-center mb-8">
                {features.map((feature, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedFeature(index)}
                    className={`py-3 px-6 text-xl ${index === selectedFeature ? 'bg-teal-500 text-white' : 'bg-transparent text-teal-900 border border-teal-500 transition-all duration-300 rounded-lg'}`}
                  >
                    {feature.title}
                  </button>
                ))}
              </div>

              <div
                className={`center p-8 rounded-xl shadow-lg ${isDarkMode ? 'bg-gray-800' : 'bg-blue-100 text-teal-900'} transition-all duration-500 ease-in-out transform hover:scale-105`}
              >
                <div className="text-4xl mb-4">
                  {features[selectedFeature].icon}
                </div>
                <h3 className="text-2xl font-bold">
                  {features[selectedFeature].title}
                </h3>
                <div className="mt-4">
                  {features[selectedFeature].description}
                </div>
              </div>
            </section>

            {/* Допълнителна информация за целите на спестяването */}
            <section className="mb-16">
              <h2
                className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-teal-900'} mb-4 flex items-center justify-center`}
              >
                <FaRegLightbulb className="mr-4 text-4xl" />
                Цели на Спестяването
              </h2>
              <p
                className={`text-xl ${isDarkMode ? 'text-gray-300' : 'text-teal-900'} max-w-3xl mx-auto`}
              >
                Нашият инструмент за цели на спестяването ти помага да планираш и следиш напредъка си в постигането на твоите финансови цели.
                Няма да пропуснеш нито една стъпка по пътя към стабилността.
              </p>
            </section>

            {/* Призив за действие */}
            <section className="mb-12">
              <h2
                className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-teal-900'} mb-4 flex items-center justify-center`}
              >
                <FaHandsHelping className="mr-4 text-4xl" />
                Готов ли си да започнеш?
              </h2>
              <p
                className={`text-xl ${isDarkMode ? 'text-gray-300' : 'text-teal-900'} max-w-2xl mx-auto`}
              >
                Започни сега и постигни финансовото си бъдеще с Тийн Бюджет! Платформата е лесна за използване, интелигентна и персонализирана.
              </p>
            </section>

            {/* Бутоните за регистрация и вход */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <button
                onClick={() => navigate('/signup')}
                className={`px-10 py-5 ${isDarkMode ? 'text-white border-2 border-teal-700' : 'text-teal-900 border-2 border-teal-500'} font-bold transition-all transform rounded-xl`}
              >
                Създай Акаунт
              </button>

              <button
                onClick={() => navigate('/login')}
                className={`px-10 py-5 ${isDarkMode ? 'border-2 border-gray-600 text-white' : 'border-2 border-teal-500 text-teal-900'} font-bold transition-all transform rounded-xl`}
              >
                Вход
              </button>
            </div>
          </div>
        </div>

        {/* Footer секция */}
        <Footer />
      </div>
    </div>
  );
};

export default WelcomePage;


