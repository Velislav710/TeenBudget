import React, { useState, ChangeEvent, FC } from 'react';
import { useTheme } from '../../context/ThemeContext';
import ThemeToggle from '../../components/ThemeToggle';
import Footer from '../../components/Footerr/Footer';
import SideMenu from '../../components/SideMenu';
import { FaEnvelope, FaUser, FaComment, FaSpinner } from 'react-icons/fa';

const Contact: FC = () => {
  const { isDarkMode } = useTheme();

  const [formData, setFormData] = useState({
    email: '',
    name: '',
  });
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

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
    setSuccessMessage('');

    const isEmpty = {
      email: !formData.email,
      name: !formData.name,
      message: !message,
    };
    setEmptyFields(isEmpty);

    if (!Object.values(isEmpty).includes(true)) {
      setIsLoading(true);

      //Изпращане на данни
      setTimeout(() => {
        console.log('Формата е изпратена с данни:', {
          email: formData.email,
          name: formData.name,
          message,
        });

        setSuccessMessage(
          'Съобщението беше изпратено успешно! Ще се свържем с вас скоро.',
        );
        setFormData({ email: '', name: '' });
        setMessage('');
        setIsLoading(false);
      }, 1500);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    sessionStorage.removeItem('authToken');
    window.location.href = '/login';
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
        <div className="max-w-7xl mx-auto px-4 py-8">
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
                  Контакти
                </h1>
                <ThemeToggle />
              </div>
              <button
                onClick={handleLogout}
                className={`px-6 py-2 rounded-md ${
                  isDarkMode
                    ? 'bg-rose-500/90 hover:bg-rose-600/90'
                    : 'bg-rose-400/90 hover:bg-rose-500/90'
                } text-white transition-all duration-200`}
                title="Изход от профила"
              >
                Изход
              </button>
            </div>
          </header>

          <main className="pt-24 flex justify-center items-center min-h-[calc(100vh-180px)]">
            <div
              className={`w-full max-w-2xl p-8 rounded-2xl ${
                isDarkMode ? 'bg-slate-800/50' : 'bg-white/50'
              } backdrop-blur-sm shadow-lg`}
            >
              <h2
                className={`text-3xl font-bold mb-6 text-center ${
                  isDarkMode ? 'text-white' : 'text-slate-800'
                }`}
              >
                Обратна връзка
              </h2>
              <p
                className={`text-center mb-8 ${
                  isDarkMode ? 'text-slate-300' : 'text-slate-600'
                }`}
              >
                Ако намерите проблем в нашето приложение или имате препоръки,
                напишете ни и ние ще отговорим възможно най-бързо!
              </p>

              {successMessage && (
                <div className="mb-6 p-4 bg-green-100 text-green-700 rounded-md text-center">
                  {successMessage}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label
                    className={`block mb-2 font-medium ${
                      isDarkMode ? 'text-slate-200' : 'text-slate-700'
                    }`}
                  >
                    Имейл <span className="text-sky-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <FaEnvelope
                        className={
                          isDarkMode ? 'text-slate-400' : 'text-slate-500'
                        }
                      />
                    </div>
                    <input
                      type="email"
                      id="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full pl-10 pr-4 py-3 rounded-xl text-lg transition-all duration-300 ${
                        emptyFields.email
                          ? 'border-red-500 bg-red-50/10 focus:ring-red-500'
                          : isDarkMode
                          ? 'bg-slate-700/50 border-slate-600 text-white placeholder-slate-400 focus:border-sky-500 focus:ring-sky-500'
                          : 'bg-white/70 border-slate-300 text-slate-900 placeholder-slate-400 focus:border-sky-500 focus:ring-sky-500'
                      } border-2 focus:ring-2 focus:outline-none`}
                      placeholder="example@teenbudget.com"
                    />
                  </div>
                  {emptyFields.email && (
                    <p className="mt-2 text-sm font-medium text-red-500">
                      Моля, въведете вашия имейл
                    </p>
                  )}
                </div>

                <div>
                  <label
                    className={`block mb-2 font-medium ${
                      isDarkMode ? 'text-slate-200' : 'text-slate-700'
                    }`}
                  >
                    Вашето име <span className="text-sky-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <FaUser
                        className={
                          isDarkMode ? 'text-slate-400' : 'text-slate-500'
                        }
                      />
                    </div>
                    <input
                      type="text"
                      id="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={`w-full pl-10 pr-4 py-3 rounded-xl text-lg transition-all duration-300 ${
                        emptyFields.name
                          ? 'border-red-500 bg-red-50/10 focus:ring-red-500'
                          : isDarkMode
                          ? 'bg-slate-700/50 border-slate-600 text-white placeholder-slate-400 focus:border-sky-500 focus:ring-sky-500'
                          : 'bg-white/70 border-slate-300 text-slate-900 placeholder-slate-400 focus:border-sky-500 focus:ring-sky-500'
                      } border-2 focus:ring-2 focus:outline-none`}
                      placeholder="Вашето име"
                    />
                  </div>
                  {emptyFields.name && (
                    <p className="mt-2 text-sm font-medium text-red-500">
                      Моля, въведете вашето име
                    </p>
                  )}
                </div>

                <div>
                  <label
                    className={`block mb-2 font-medium ${
                      isDarkMode ? 'text-slate-200' : 'text-slate-700'
                    }`}
                  >
                    Вашето съобщение <span className="text-sky-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 top-3 flex items-start pl-3 pointer-events-none">
                      <FaComment
                        className={
                          isDarkMode ? 'text-slate-400' : 'text-slate-500'
                        }
                      />
                    </div>
                    <textarea
                      id="message"
                      value={message}
                      onChange={handleMessageChange}
                      className={`w-full pl-10 pr-4 py-3 rounded-xl text-lg transition-all duration-300 min-h-[150px] ${
                        emptyFields.message
                          ? 'border-red-500 bg-red-50/10 focus:ring-red-500'
                          : isDarkMode
                          ? 'bg-slate-700/50 border-slate-600 text-white placeholder-slate-400 focus:border-sky-500 focus:ring-sky-500'
                          : 'bg-white/70 border-slate-300 text-slate-900 placeholder-slate-400 focus:border-sky-500 focus:ring-sky-500'
                      } border-2 focus:ring-2 focus:outline-none`}
                      placeholder="Вашето съобщение..."
                      maxLength={200}
                      rows={4}
                    />
                  </div>
                  <div className="flex justify-between mt-2">
                    {emptyFields.message && (
                      <p className="text-sm font-medium text-red-500">
                        Моля, въведете вашето съобщение
                      </p>
                    )}
                    <small
                      className={`ml-auto ${
                        isDarkMode ? 'text-slate-400' : 'text-slate-600'
                      } ${message.length >= 180 ? 'text-amber-500' : ''}`}
                    >
                      {message.length} / 200
                    </small>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full ${
                    isDarkMode
                      ? 'bg-sky-500/90 hover:bg-sky-600/90'
                      : 'bg-sky-400/90 hover:bg-sky-500/90'
                  } text-white font-bold py-4 rounded-xl transition-all transform hover:scale-105 text-lg shadow-xl ${
                    isLoading ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <FaSpinner className="animate-spin mr-2" /> Изпращане...
                    </span>
                  ) : (
                    'Изпрати съобщение'
                  )}
                </button>
              </form>
            </div>
          </main>
        </div>

        <Footer />
      </div>
    </div>
  );
};

export default Contact;
