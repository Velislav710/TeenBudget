/**
 * Проверява дали токенът, съхранен в localStorage или sessionStorage, е валиден,
 * и връща URL за пренасочване, ако токенът не е валиден.
 *
 * @async
 * @function checkTokenValidity
 * @returns {Promise<string | null>} - Връща URL за пренасочване или null, ако токенът е валиден.
 * @throws {Error} - Хвърля грешка, ако заявката за проверка на токена е неуспешна.
 */
export const checkTokenValidity = async (): Promise<string | null> => {
  // Извличане на токена от localStorage или sessionStorage
  const token =
    localStorage.getItem('authToken') || sessionStorage.getItem('authToken');

  if (!token) {
    // Ако няма намерен токен, връща URL за пренасочване
    return '/signin';
  }

  try {
    // Изпращане на заявка за валидиране на токена
    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/token-validation`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }), // Предаване на токена в тялото на заявката
      },
    );

    const data = await response.json(); // Извличане на отговора като JSON

    if (!data.valid) {
      // Ако "valid" в отговора е false, връща URL за пренасочване
      console.warn('Token is invalid, redirecting to /signin...');
      return '/signin';
    }

    return null; // Токенът е валиден, няма нужда от пренасочване
  } catch (error) {
    // Обработка на грешки при валидирането на токена
    console.error('Error validating token:', error);
    return '/signin'; // Пренасочване към страницата за вход
  }
};
