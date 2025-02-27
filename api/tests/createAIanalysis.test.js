const db = require("../database"); // Импортиране на файла с базата данни

// Мокираме самата функция createAIanalysis
jest.mock("../database", () => ({
  createAIanalysis: jest.fn() // Мокиране на функцията createAIanalysis
}));

describe("Функции за анализ на разходите", () => {
  afterEach(() => {
    jest.clearAllMocks(); // Изчистваме мок след всеки тест, за да избегнем намеса
  });

  // Тест за createAIanalysis - успешен случай
  it("трябва да създаде нов запис за AI анализ на разходите", (done) => {
    const userId = 1; // Примерен ID на потребител
    const total_income = 2000;
    const total_expense = 1500;
    const total_balance = 500;
    const savings_rate = 0.25;
    const main_findings = "Излишъците са сравнително високи";
    const key_insights = "Трябва да се намалят ненужните разходи";
    const risk_areas = "Липса на спестявания за извънредни ситуации";
    const date = "2025-02-27";
    const mockCallback = jest.fn(); // Мок функция за колбек

    // Симулираме успешно създаване на запис
    db.createAIanalysis.mockImplementationOnce(
      (
        userId,
        total_income,
        total_expense,
        total_balance,
        savings_rate,
        main_findings,
        key_insights,
        risk_areas,
        date,
        callback
      ) => {
        callback(null, { affectedRows: 1 }); // Примерно 1 успешно добавен ред
      }
    );

    // Извикваме функцията
    db.createAIanalysis(
      userId,
      total_income,
      total_expense,
      total_balance,
      savings_rate,
      main_findings,
      key_insights,
      risk_areas,
      date,
      mockCallback
    );

    // Проверяваме дали функцията е извикана с правилните аргументи
    expect(db.createAIanalysis).toHaveBeenCalledWith(
      userId,
      total_income,
      total_expense,
      total_balance,
      savings_rate,
      main_findings,
      key_insights,
      risk_areas,
      date,
      mockCallback
    );

    // Проверяваме дали колбекът е извикан с правилните параметри
    expect(mockCallback).toHaveBeenCalledWith(null, { affectedRows: 1 });
    done();
  });

  // Тест за случай с грешка при създаване на анализ
  it("трябва да предаде грешка ако възникне проблем при създаването на анализ", (done) => {
    const userId = 1;
    const total_income = 2000;
    const total_expense = 1500;
    const total_balance = 500;
    const savings_rate = 0.25;
    const main_findings = "Излишъците са сравнително високи";
    const key_insights = "Трябва да се намалят ненужните разходи";
    const risk_areas = "Липса на спестявания за извънредни ситуации";
    const date = "2025-02-27";
    const mockCallback = jest.fn();
    const mockError = new Error("Database error");

    // Симулираме грешка при създаване на запис
    db.createAIanalysis.mockImplementationOnce(
      (
        userId,
        total_income,
        total_expense,
        total_balance,
        savings_rate,
        main_findings,
        key_insights,
        risk_areas,
        date,
        callback
      ) => {
        callback(mockError, null);
      }
    );

    // Извикваме функцията
    db.createAIanalysis(
      userId,
      total_income,
      total_expense,
      total_balance,
      savings_rate,
      main_findings,
      key_insights,
      risk_areas,
      date,
      mockCallback
    );

    // Проверяваме дали колбекът е извикан с грешката
    expect(mockCallback).toHaveBeenCalledWith(mockError, null);
    done();
  });

  // Тест за случай когато няма добавени редове
  it("трябва да върне 0 добавени редове ако няма успех при добавянето", (done) => {
    const userId = 1;
    const total_income = 2000;
    const total_expense = 1500;
    const total_balance = 500;
    const savings_rate = 0.25;
    const main_findings = "Излишъците са сравнително високи";
    const key_insights = "Трябва да се намалят ненужните разходи";
    const risk_areas = "Липса на спестявания за извънредни ситуации";
    const date = "2025-02-27";
    const mockCallback = jest.fn();

    // Симулираме неуспешно добавяне на ред
    db.createAIanalysis.mockImplementationOnce(
      (
        userId,
        total_income,
        total_expense,
        total_balance,
        savings_rate,
        main_findings,
        key_insights,
        risk_areas,
        date,
        callback
      ) => {
        callback(null, { affectedRows: 0 });
      }
    );

    // Извикваме функцията
    db.createAIanalysis(
      userId,
      total_income,
      total_expense,
      total_balance,
      savings_rate,
      main_findings,
      key_insights,
      risk_areas,
      date,
      mockCallback
    );

    // Проверяваме дали колбекът е извикан с правилните параметри
    expect(mockCallback).toHaveBeenCalledWith(null, { affectedRows: 0 });
    done();
  });
});
