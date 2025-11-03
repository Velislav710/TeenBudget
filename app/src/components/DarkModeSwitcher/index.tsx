import { useState } from 'react';

const DarkModeSwitcher = () => {
  const [isDark, setIsDark] = useState(false);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <li>
      <button
        aria-label="Toggle Dark Mode"
        onClick={toggleTheme}
        className="flex items-center rounded-full bg-gray-200 px-2 py-1 dark:bg-boxdark"
      >
        {isDark ? (
          <svg
            className="fill-primary"
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M8 12.8889C10.7614 12.8889 13 10.6503 13 7.88889C13 5.12751 10.7614 2.88889 8 2.88889C5.23858 2.88889 3 5.12751 3 7.88889C3 10.6503 5.23858 12.8889 8 12.8889Z" />
          </svg>
        ) : (
          <svg
            className="fill-primary"
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M8 11.1111C9.72376 11.1111 11.1111 9.72376 11.1111 8C11.1111 6.27624 9.72376 4.88889 8 4.88889C6.27624 4.88889 4.88889 6.27624 4.88889 8C4.88889 9.72376 6.27624 11.1111 8 11.1111Z" />
          </svg>
        )}
      </button>
    </li>
  );
};

export default DarkModeSwitcher;
