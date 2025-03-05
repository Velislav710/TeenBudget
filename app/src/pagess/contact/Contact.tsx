import React, { useState, ChangeEvent, FC } from 'react';
import { useTheme } from '../../context/ThemeContext';
import ThemeToggle from '../../components/ThemeToggle';
import Footer from '../../components/Footerr/Footer';
import SideMenu from '../../components/SideMenu';

const Contact: FC = () => {
  const { isDarkMode } = useTheme();
  const [formData, setFormData] = useState({
    email: '',
    name: '',
  });
  const [message, setMessage] = useState('');
  const [emptyFields, setEmptyFields] = useState({
    email: false,
    name: false,
    message: false,
  });

  const handleInputChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { id, value } = event.target;
    setFormData((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };

  const handleMessageChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const inputValue = event.target.value;
    if (inputValue.length <= 200) {
      setMessage(inputValue);
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const isEmpty = {
      email: !formData.email,
      name: !formData.name,
      message: !message,
    };
    setEmptyFields(isEmpty);

    if (!Object.values(isEmpty).includes(true)) {
      console.log('Формата е изпратена с данни:', {
        email: formData.email,
        name: formData.name,
        message,
      });
      setFormData({ email: '', name: '' });
      setMessage('');
    }
  };

  const inputClasses = (hasError: boolean) => `
    w-full px-4 py-3 rounded-xl text-lg transition-all duration-300
    ${
      isDarkMode
        ? hasError
          ? 'bg-red-900/20 border-2 border-red-500 text-white placeholder-red-400'
          : 'bg-slate-700/50 border-2 border-slate-600 text-white placeholder-slate-400 focus:border-sky-500'
        : hasError
        ? 'bg-red-50 border-2 border-red-500 text-red-900 placeholder-red-400'
        : 'bg-white border-2 border-slate-300 text-slate-900 placeholder-slate-400 focus:border-sky-500'
    }
  `;

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
        <div className="max-w-7xl mx-auto px-4 py-8">
          <header
            className={`fixed top-0 right-0 left-64 z-10 ${
              isDarkMode ? 'bg-slate-800/95' : 'bg-white/95'
            } backdrop-blur-sm shadow-sm px-8 py-4`}
          >
            <div className="max-w-7xl mx-auto flex justify-between items-center">
              <div className="flex items-center gap-4">
                <h1
                  className={`text-2xl font-bold ${
                    isDarkMode ? 'text-white' : 'text-slate-800'
                  }`}
                >
                  Контакти
                </h1>
                <ThemeToggle />
              </div>
            </div>
          </header>

          <main className="pt-24">
            <div
              className={`mb-8 p-6 rounded-xl ${
                isDarkMode ? 'bg-slate-800/50' : 'bg-white/50'
              } backdrop-blur-sm shadow-xl`}
            >
              <h2
                className={`text-3xl font-bold mb-4 ${
                  isDarkMode ? 'text-white' : 'text-slate-800'
                }`}
              >
                Обратна връзка
              </h2>
              <p
                className={`text-lg ${
                  isDarkMode ? 'text-slate-300' : 'text-slate-600'
                }`}
              >
                Ако намерите проблем в нашето приложение или имате препоръки,
                напишете ни и ние ще отговорим възможно най-бързо!
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className={`p-8 rounded-xl ${
                isDarkMode ? 'bg-slate-800/50' : 'bg-white/50'
              } backdrop-blur-sm shadow-xl`}
            >
              <div className="space-y-6">
                <div>
                  <label
                    className={`text-base font-semibold block mb-2 ${
                      isDarkMode ? 'text-slate-200' : 'text-slate-700'
                    }`}
                  >
                    Email <span className="text-sky-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    className={inputClasses(emptyFields.email)}
                    placeholder="example@teenbudget.com"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </div>

                <div>
                  <label
                    className={`text-base font-semibold block mb-2 ${
                      isDarkMode ? 'text-slate-200' : 'text-slate-700'
                    }`}
                  >
                    Вашето име <span className="text-sky-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    className={inputClasses(emptyFields.name)}
                    placeholder="Вашето име"
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                </div>

                <div>
                  <label
                    className={`text-base font-semibold block mb-2 ${
                      isDarkMode ? 'text-slate-200' : 'text-slate-700'
                    }`}
                  >
                    Вашето съобщение <span className="text-sky-500">*</span>
                  </label>
                  <textarea
                    className={`${inputClasses(
                      emptyFields.message,
                    )} min-h-[150px]`}
                    placeholder="Вашето съобщение..."
                    value={message}
                    onChange={handleMessageChange}
                    maxLength={200}
                    rows={4}
                  />
                  <div className="text-right mt-2">
                    <small
                      className={
                        isDarkMode ? 'text-slate-400' : 'text-slate-600'
                      }
                    >
                      {message.length} / 200
                    </small>
                  </div>
                </div>

                <button
                  type="submit"
                  className={`w-full ${
                    isDarkMode
                      ? 'bg-sky-500/90 hover:bg-sky-600/90'
                      : 'bg-sky-400/90 hover:bg-sky-500/90'
                  } text-white font-bold py-4 rounded-xl transition-all transform hover:scale-105 text-lg shadow-xl`}
                >
                  Изпрати съобщение
                </button>
              </div>
            </form>
          </main>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default Contact;
