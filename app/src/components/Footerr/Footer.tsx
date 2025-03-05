import React from 'react';
import { Link } from 'react-router-dom';
import { FaNode, FaNpm, FaReact, FaDatabase } from 'react-icons/fa';
import {
  SiTypescript,
  SiTailwindcss,
  SiApache,
  SiExpress,
  SiJsonwebtokens,
  SiOpenai,
  SiJest,
} from 'react-icons/si';
import { TbApi } from 'react-icons/tb';

const Footer = () => {
  return (
    <footer
      className={`bg-gradient-to-r from-slate-800 to-slate-900 text-white`}
    >
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Информация за приложението */}
          <div>
            <h3 className="text-xl font-bold mb-4">Тийн Бюджет</h3>
            <p className="text-slate-300">
              Управлявайте финансите си умно и вземайте информирани решения за
              вашето бъдеще.
            </p>
            <div className="mt-4">
              <Link
                to="https://pgi-pernik.bg-schools.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-300 hover:text-sky-400 block"
              >
                ПГИ - Перник
              </Link>
              <p className="text-slate-400 mt-2">Създатели:</p>
              <p className="text-slate-300">Велислав Велинов</p>
              <p className="text-slate-300">Виктор Владимиров</p>
            </div>
          </div>

          {/* Източници */}
          <div>
            <h4 className="text-lg font-bold mb-4">Източници</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="https://edusoft.fmi.uni-sofia.bg/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-300 hover:text-sky-400"
                >
                  НОИТ
                </Link>
              </li>
              <li>
                <Link
                  to="https://platform.openai.com/docs/overview"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-300 hover:text-sky-400 flex items-center gap-2"
                >
                  <SiOpenai className="text-xl" /> OpenAI API
                </Link>
              </li>
            </ul>
          </div>

          {/* Използвани технологии */}
          <div>
            <h4 className="text-lg font-bold mb-4">Използвани технологии</h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2 text-slate-300">
                <FaNode className="text-xl" /> NodeJS
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <FaNpm className="text-xl" /> NPM
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <FaReact className="text-xl" /> ReactJS
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <SiTypescript className="text-xl" /> TypeScript
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <SiTailwindcss className="text-xl" /> Tailwind
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <FaDatabase className="text-xl" /> MySQL
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <SiApache className="text-xl" /> Apache
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <TbApi className="text-xl" /> Fetch API
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <SiOpenai className="text-xl" /> OpenAI
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <SiExpress className="text-xl" /> ExpressJS
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <SiJsonwebtokens className="text-xl" /> JWT
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <SiJest className="text-xl" /> Jest
              </div>
            </div>
          </div>

          {/* Бързи връзки */}
          <div>
            <h4 className="text-lg font-bold mb-4">Бързи връзки</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/main" className="text-slate-300 hover:text-sky-400">
                  Начално табло
                </Link>
              </li>
              <li>
                <Link
                  to="/home/budget-planning"
                  className="text-slate-300 hover:text-sky-400"
                >
                  Планиране на бюджет
                </Link>
              </li>
              <li>
                <Link
                  to="/home/expense-analytics"
                  className="text-slate-300 hover:text-sky-400"
                >
                  Анализ на разходите
                </Link>
              </li>
              <li>
                <Link
                  to="/home/financial-education"
                  className="text-slate-300 hover:text-sky-400"
                >
                  Финансово образование
                </Link>
              </li>

              <li>
                <Link
                  to="/contact"
                  className="text-slate-300 hover:text-sky-400"
                >
                  Контакти
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Долна част */}
        <div className="border-t border-slate-700 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-slate-400">
            © 2025 Тийн Бюджет. Всички права запазени.
          </p>

          {/* GitHub линк */}
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link
              to="https://github.com/Velislav710/TeenBudget"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-sky-400 transition-colors"
            >
              <span className="sr-only">GitHub</span>
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path
                  fillRule="evenodd"
                  d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                  clipRule="evenodd"
                />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
