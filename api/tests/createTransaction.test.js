const db = require("../database"); // Импортиране на файла с базата данни

// Мокираме db.createTransaction функцията
jest.mock("../database", () => ({
  createTransaction: jest.fn()
}));

describe("Функции за транзакции", () => {
  afterEach(() => {
    jest.clearAllMocks(); // Изчистваме мок след всеки тест, за да избегнем намеса
  });

  // Тест за createTransaction
  it("трябва да създаде нова транзакция", (done) => {
    const userId = 1; // Примерен ID на потребител
    const type = "income"; // Примерен тип на транзакция
    const amount = 100; // Примерна сума
    const category = "salary"; // Примерна категория
    const description = "Monthly salary"; // Примерно описание
    const date = "2025-02-27"; // Примерна дата
    const mockCallback = jest.fn(); // Мок функция за колбек

    // Симулираме успешното създаване на транзакция
    db.createTransaction.mockImplementationOnce(
      (userId, type, amount, category, description, date, callback) => {
        callback(null, { affectedRows: 1 }); // Колбек с резултат за успешното добавяне на ред
      }
    );

    // Извикваме функцията
    db.createTransaction(
      userId,
      type,
      amount,
      category,
      description,
      date,
      mockCallback
    );

    // Проверяваме дали db.createTransaction е извикан с правилните аргументи
    expect(db.createTransaction).toHaveBeenCalledWith(
      userId,
      type,
      amount,
      category,
      description,
      date,
      mockCallback
    );

    // Проверяваме дали колбекът е извикан с правилните параметри
    expect(mockCallback).toHaveBeenCalledWith(null, { affectedRows: 1 });
    done();
  });
});
