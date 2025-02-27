const db = require("../database"); // Импортиране на файла с базата данни

// Мокираме db.getTransactionsByUserId функцията
jest.mock("../database", () => ({
  getTransactionsByUserId: jest.fn() // Мокиране на функцията getTransactionsByUserId
}));

describe("Функции за извличане на транзакции", () => {
  afterEach(() => {
    jest.clearAllMocks(); // Изчистваме мок след всеки тест, за да избегнем намеса
  });

  // Тест за getTransactionsByUserId
  it("трябва да извлече транзакциите на потребител", (done) => {
    const userId = 1; // Примерен ID на потребител
    const mockCallback = jest.fn(); // Мок функция за колбек

    // Примерни данни за транзакции
    const mockTransactions = [
      {
        id: 1,
        user_id: 1,
        type: "income",
        amount: 100,
        category: "salary",
        description: "Monthly salary",
        date: "2025-02-27"
      },
      {
        id: 2,
        user_id: 1,
        type: "expense",
        amount: 50,
        category: "food",
        description: "Groceries",
        date: "2025-02-26"
      }
    ];

    // Симулираме успешно извличане на транзакции
    db.getTransactionsByUserId.mockImplementationOnce((userId, callback) => {
      callback(null, mockTransactions); // Колбек с резултат за успешното извличане
    });

    // Извикваме функцията
    db.getTransactionsByUserId(userId, mockCallback);

    // Проверяваме дали db.getTransactionsByUserId е извикан с правилните аргументи
    expect(db.getTransactionsByUserId).toHaveBeenCalledWith(
      userId,
      mockCallback
    );

    // Проверяваме дали колбекът е извикан с правилните параметри
    expect(mockCallback).toHaveBeenCalledWith(null, mockTransactions);
    done();
  });

  // Тест за случай с грешка при извличане
  it("трябва да предаде грешка ако възникне проблем", (done) => {
    const userId = 1;
    const mockCallback = jest.fn();
    const mockError = new Error("Database error");

    // Симулираме грешка при извличане
    db.getTransactionsByUserId.mockImplementationOnce((userId, callback) => {
      callback(mockError, null);
    });

    // Извикваме функцията
    db.getTransactionsByUserId(userId, mockCallback);

    // Проверяваме дали колбекът е извикан с грешката
    expect(mockCallback).toHaveBeenCalledWith(mockError, null);
    done();
  });
});
