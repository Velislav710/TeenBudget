import React, { useState, ChangeEvent, FC } from 'react';
import { useTheme } from '../../context/ThemeContext';

const Contact: FC = () => {
  const { isDarkMode } = useTheme();

  // Състояние за данните от формата
  const [formData, setFormData] = useState({
    email: '',
    name: '',
  });

  // Състояние за съобщението
  const [message, setMessage] = useState('');

  // Състояние за валидация на празни полета
  const [emptyFields, setEmptyFields] = useState({
    email: false,
    name: false,
    message: false,
  });

  // Функция за обработка на промени в полетата за имейл и име
  const handleInputChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { id, value } = event.target;
    setFormData((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };

  // Функция за обработка на промени в съобщението (textarea)
  const handleMessageChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const inputValue = event.target.value;
    if (inputValue.length <= 200) {
      setMessage(inputValue);
    }
  };

  // Обработка на изпращането на формата
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    // Валидация за празни полета
    const isEmpty = {
      email: !formData.email,
      name: !formData.name,
      message: !message,
    };

    // Задаваме състоянието за празни полета
    setEmptyFields(isEmpty);

    // Ако няма празни полета, изпращаме данните от формата
    if (!Object.values(isEmpty).includes(true)) {
      console.log('Формата е изпратена с данни:', {
        email: formData.email,
        name: formData.name,
        message,
      });

      // Рестартиране на формата след изпращането
      setFormData({ email: '', name: '' });
      setMessage('');
    }
  };

  return (
    <div
      className={`min-h-screen ${
        isDarkMode
          ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900'
          : 'bg-gradient-to-br from-emerald-400 via-yellow-300 to-amber-400'
      }`}
    >
      <div className="container mx-auto pt-20 pb-20 px-4">
        {/* Основен раздел с информация */}
        <div
          className={`mb-10 p-6 rounded-xl ${
            isDarkMode ? 'bg-gray-800/90' : 'bg-white/90'
          } shadow-xl backdrop-blur-sm border-2 ${
            isDarkMode ? 'border-gray-700' : 'border-emerald-500/30'
          }`}
        >
          <h2
            className={`text-3xl font-bold mb-4 ${
              isDarkMode ? 'text-white' : 'text-gray-800'
            }`}
          >
            Обратна връзка
          </h2>
          <hr
            className={`my-4 ${
              isDarkMode ? 'border-gray-700' : 'border-emerald-500/30'
            }`}
          />
          <p
            className={`${
              isDarkMode ? 'text-gray-300' : 'text-gray-600'
            } text-lg`}
          >
            Ако намерите проблем в нашето приложение или имате препоръки,
            напишете ни и ние ще отговорим възможно най-бързо!
          </p>
        </div>

        {/* Карта за форма за обратна връзка */}
        <div
          className={`p-8 rounded-xl ${
            isDarkMode ? 'bg-gray-800/90' : 'bg-white/90'
          } shadow-xl backdrop-blur-sm border-2 ${
            isDarkMode ? 'border-gray-700' : 'border-emerald-500/30'
          }`}
        >
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 gap-8">
              {/* Поле за имейл */}
              <div>
                <label
                  className={`block text-lg font-medium mb-2 ${
                    isDarkMode ? 'text-gray-200' : 'text-gray-700'
                  }`}
                >
                  Email <span className="text-emerald-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  className={`w-full px-4 py-3 rounded-xl border-2 ${
                    isDarkMode
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-white border-gray-200'
                  } focus:ring-2 focus:ring-emerald-500 transition-all ${
                    emptyFields.email ? 'border-red-500' : ''
                  }`}
                  placeholder="example@teenbudget.com"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>

              {/* Поле за име */}
              <div>
                <label
                  className={`block text-lg font-medium mb-2 ${
                    isDarkMode ? 'text-gray-200' : 'text-gray-700'
                  }`}
                >
                  Вашето име <span className="text-emerald-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  className={`w-full px-4 py-3 rounded-xl border-2 ${
                    isDarkMode
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-white border-gray-200'
                  } focus:ring-2 focus:ring-emerald-500 transition-all ${
                    emptyFields.name ? 'border-red-500' : ''
                  }`}
                  placeholder="Вашето име"
                  value={formData.name}
                  onChange={handleInputChange}
                />
              </div>

              {/* Поле за съобщение */}
              <div>
                <label
                  className={`block text-lg font-medium mb-2 ${
                    isDarkMode ? 'text-gray-200' : 'text-gray-700'
                  }`}
                >
                  Вашето съобщение <span className="text-emerald-500">*</span>
                </label>
                <textarea
                  className={`w-full px-4 py-3 rounded-xl border-2 ${
                    isDarkMode
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-white border-gray-200'
                  } focus:ring-2 focus:ring-emerald-500 transition-all min-h-[150px] ${
                    emptyFields.message ? 'border-red-500' : ''
                  }`}
                  placeholder="Вашето съобщение..."
                  value={message}
                  onChange={handleMessageChange}
                  maxLength={200}
                  rows={4}
                />
                <div className="text-right mt-2">
                  <small
                    className={`${
                      isDarkMode ? 'text-gray-400' : 'text-gray-600'
                    } text-sm`}
                  >
                    {message.length} / 200
                  </small>
                </div>
              </div>

              {/* Бутон за изпращане */}
              <button
                type="submit"
                className={`w-full py-4 rounded-xl ${
                  isDarkMode
                    ? 'bg-emerald-600 hover:bg-emerald-700'
                    : 'bg-emerald-500 hover:bg-emerald-600'
                } text-white text-lg font-medium transition-all transform hover:scale-[1.02] shadow-lg`}
              >
                Изпрати съобщение
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
