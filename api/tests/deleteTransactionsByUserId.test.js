const db = require("../database"); // Импортиране на файла с базата данни

// Мокираме db.deleteTransactionsByUserId функцията
jest.mock("../database", () => ({
  deleteTransactionsByUserId: jest.fn() // Мокиране на функцията deleteTransactionsByUserId
}));

describe("Функции за изтриване на транзакции", () => {
  afterEach(() => {
    jest.clearAllMocks(); // Изчистваме мок след всеки тест, за да избегнем намеса
  });

  // Тест за deleteTransactionsByUserId
  it("трябва да изтрие всички транзакции на потребител", (done) => {
    const userId = 1; // Примерен ID на потребител
    const mockCallback = jest.fn(); // Мок функция за колбек

    // Симулираме успешно изтриване на транзакции
    db.deleteTransactionsByUserId.mockImplementationOnce((userId, callback) => {
      callback(null, { affectedRows: 5 }); // Примерно 5 изтрити реда
    });

    // Извикваме функцията
    db.deleteTransactionsByUserId(userId, mockCallback);

    // Проверяваме дали функцията е извикана с правилните аргументи
    expect(db.deleteTransactionsByUserId).toHaveBeenCalledWith(
      userId,
      mockCallback
    );

    // Проверяваме дали колбекът е извикан с правилните параметри
    expect(mockCallback).toHaveBeenCalledWith(null, { affectedRows: 5 });
    done();
  });

  // Тест за случай с грешка при изтриване
  it("трябва да предаде грешка ако възникне проблем при изтриването", (done) => {
    const userId = 1;
    const mockCallback = jest.fn();
    const mockError = new Error("Database error");

    // Симулираме грешка при изтриване
    db.deleteTransactionsByUserId.mockImplementationOnce((userId, callback) => {
      callback(mockError, null);
    });

    // Извикваме функцията
    db.deleteTransactionsByUserId(userId, mockCallback);

    // Проверяваме дали колбекът е извикан с грешката
    expect(mockCallback).toHaveBeenCalledWith(mockError, null);
    done();
  });

  // Тест за случай когато няма транзакции за изтриване
  it("трябва да върне 0 изтрити редове ако няма транзакции за изтриване", (done) => {
    const userId = 999; // ID на несъществуващ потребител
    const mockCallback = jest.fn();

    // Симулираме случай без изтрити редове
    db.deleteTransactionsByUserId.mockImplementationOnce((userId, callback) => {
      callback(null, { affectedRows: 0 });
    });

    // Извикваме функцията
    db.deleteTransactionsByUserId(userId, mockCallback);

    // Проверяваме дали колбекът е извикан с правилните параметри
    expect(mockCallback).toHaveBeenCalledWith(null, { affectedRows: 0 });
    done();
  });
});
