import {
  DashboardAnalysis,
  TransactionAnalysisData,
  AIResult,
} from './home-types';

export const fetchDashboardAnalysis = async (
  transactionData: TransactionAnalysisData,
) => {
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${(import.meta as any).env.VITE_OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: `Ти си професионален финансов анализатор за тийнейджъри. Анализирай финансовите данни и създай полезни препоръки на книжовен български език. Отговаряй само в следния JSON формат:
            {
              "analysis": {
                "summary": "Подробно обобщение на финансовото състояние",
                "recommendations": ["3 конкретни и практични препоръки"],
                "savingsPotential": "процент възможни спестявания (число)",
                "monthlyTrend": "тенденция спрямо предходен период",
                "topCategory": "категорията с най-много транзакции"
              }
            }`,
          },
          {
            role: 'user',
            content: `Анализирай следните финансови данни и дай конкретни препоръки:
            ${JSON.stringify(transactionData, null, 2)}`,
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API Error: ${response.status}`);
    }

    // --- TESTING: ---
    // const data =
    //   '{\n  "analysis": {\n    "summary": "Общите приходи за периода са 158 лева, при разходи от 55 лева, което остава баланс от 103 лева. Спестяване от 65.2% е отличен резултат. Най-голямата част от приходите са от категория \'Работа\', а най-големите разходи са за \'Храна\'.",\n    "recommendations": ["Създайте бюджет за храна, тъй като това е най-голямата ви категория за разходи.", "Поддържайте високата си степен на спестяване, като продължите да контролирате разходите си.", "Опитайте да увеличите приходите си от \'Джобни\', възможно е да има потенциал за повече доходи там."],\n    "savingsPotential": "34.8",\n    "monthlyTrend": "Приходите и разходите са се увеличили спрямо предходния период, но спестяванията са също увеличени, което е положително.",\n    "topCategory": "Храна"\n  }\n}';
    const data = await response.json();
    const content = data.choices[0]?.message?.content;

    return content ? JSON.parse(content) : null;
  } catch (error) {
    console.error('AI Analysis Error:', error);
    return null;
  }
};

export const saveDashboardAnalysis = async ({
  userId,
  summary,
  recommendations,
  savingsPotential,
  monthlyTrend,
  topCategory,
}: DashboardAnalysis) => {
  try {
    const token =
      localStorage.getItem('authToken') || sessionStorage.getItem('authToken');

    // Изпращаме POST заявка до сървъра за запис на анализите
    const response = await fetch(
      `${(import.meta as any).env.VITE_API_BASE_URL}/save-dashboard-analysis`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId,
          summary,
          recommendations,
          savingsPotential,
          monthlyTrend,
          topCategory,
        }),
      },
    );

    if (!response.ok) {
      throw new Error('Грешка при записване на анализа');
    }

    const responseJson = await response.json();
    console.log('Записът на анализа беше успешен:', responseJson);
    return responseJson;
  } catch (error) {
    console.error('Грешка при записа на анализа:', error);
    return { error: 'Грешка при записа на анализа' };
  }
};

export const fetchExpenseAnalytics = async (
  transactionData: TransactionAnalysisData,
) => {
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${(import.meta as any).env.VITE_OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: `Ти си професионален финансов анализатор за тийнейджъри. Анализирай финансовите данни и създай изключително подробен анализ на български език. Отговаряй в следния JSON формат:
            {
              "analysis": {
                "overallSummary": {
                  "mainFindings": "подробно обобщение на финансовото състояние в поне 150 думи",
                  "keyInsights": ["3 ключови извода с конкретни числа и проценти"],
                  "riskAreas": ["3 рискови области с подробно обяснение"]
                },
                "categoryAnalysis": {
                  "topCategory": "най-голяма категория разходи с подробен анализ",
                  "categoryBreakdown": [{
                    "category": "име на категория",
                    "analysis": "100 думи анализ за всяка категория",
                    "trends": "детайлни тенденции",
                    "recommendations": ["3 конкретни препоръки"]
                  }]
                },
                "behavioralInsights": {
                  "spendingPatterns": "подробен анализ на моделите на харчене в 100 думи",
                  "emotionalTriggers": ["3 емоционални тригера за харчене"],
                  "socialFactors": "влияние на социалната среда върху харченето"
                },
                "detailedRecommendations": {
                  "immediate": ["3 спешни действия с обяснение"],
                  "shortTerm": ["3 краткосрочни препоръки"],
                  "longTerm": ["3 дългосрочни стратегии"]
                },
                "educationalGuidance": {
                  "financialLiteracy": "100 думи образователни насоки",
                  "practicalSkills": ["3 практически умения за развиване"],
                  "resources": ["3 препоръчани ресурса за обучение"]
                },
                "futureProjections": {
                  "nextMonth": "прогноза за следващия месец",
                  "threeMonths": "тримесечна прогноза",
                  "savingsPotential": "конкретен план за спестявания"
                }
              }
            }`,
          },
          {
            role: 'user',
            content: `Анализирай следните финансови данни и създай изключително подробен анализ:
            ${JSON.stringify(transactionData, null, 2)}`,
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API Error: ${response.status}`);
    }

    const responseData = await response.json();
    const responseJson = responseData.choices[0]?.message?.content;
    const unescapedData = responseJson
      .replace(/^```json([\s\S]*?)```$/, '$1')
      .replace(/^```JSON([\s\S]*?)```$/, '$1')
      .replace(/^```([\s\S]*?)```$/, '$1')
      .replace(/^'|'$/g, '')
      .trim();

    const parsedData = JSON.parse(unescapedData);
    console.log('transaction data bs', transactionData);
    return parsedData;
  } catch (error) {
    console.error('AI Analysis Error:', error);
    return null;
  }
};

export const fetchFinancialAnalysisAI = async (planningData: {
  expectedIncome: number;
  previousCategories: Record<string, number>;
}) => {
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${(import.meta as any).env.VITE_OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: `Ти си финансов съветник за тийнейджъри. Анализирай предишните разходи и предложи оптимално разпределение на бюджета за следващия месец. Върни отговора само в следния JSON формат:
            {
              "suggestions": {
                "Храна": число,
                "Транспорт": число,
                "Развлечения": число,
                "Спорт и здраве": число,
                "Образование": число,
                "Дрехи": число,
                "Други": число
              },
              "analysis": {
                "recommendations": [
                  "конкретен съвет за оптимизиране на разходите",
                  "съвет за спестяване",
                  "препоръка за балансиране на бюджета"
                ]
              }
            }`,
          },
          {
            role: 'user',
            content: `Разпредели ${
              planningData.expectedIncome
            } лв. по категориите, като вземеш предвид предишните средни разходи:
            ${JSON.stringify(planningData.previousCategories, null, 2)}.
            Дай разумни препоръки за оптимизиране на бюджета спрямо тенденциите в харченето.`,
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API Error: ${response.status}`);
    }

    const responseData = await response.json();
    const responseJson = responseData.choices[0]?.message?.content;
    const unescapedData = responseJson
      .replace(/^```json([\s\S]*?)```$/, '$1')
      .replace(/^```JSON([\s\S]*?)```$/, '$1')
      .replace(/^```([\s\S]*?)```$/, '$1')
      .replace(/^'|'$/g, '')
      .trim();

    const parsedData = JSON.parse(unescapedData);

    return parsedData;
  } catch (error) {
    console.error('AI Analysis Error:', error);
    return null;
  }
};

export const saveFinancialAnalysis = async ({
  analysis,
  suggestions,
}: AIResult) => {
  try {
    const token =
      localStorage.getItem('authToken') || sessionStorage.getItem('authToken');

    // Sending POST request to the server to save the financial analysis
    const response = await fetch(
      `${(import.meta as any).env.VITE_API_BASE_URL}/save-financial-analysis`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          food: suggestions.Храна,
          transport: suggestions.Транспорт,
          entertainment: suggestions.Развлечения,
          sport_and_health: suggestions['Спорт и здраве'],
          education: suggestions.Образование,
          clothes: suggestions.Дрехи,
          others: suggestions.Други,
          recommendations: analysis.recommendations,
        }),
      },
    );

    if (!response.ok) {
      throw new Error('Грешка при записване на финансовия анализ');
    }

    const responseJson = await response.json();
    console.log('Записът на финансовия анализ беше успешен:', responseJson);
    return responseJson;
  } catch (error) {
    console.error('Грешка при записа на финансовия анализ:', error);
    return { error: 'Грешка при записа на финансовия анализ' };
  }
};

export const generateAIAnalysis = async (goalData: {
  name: string;
  targetAmount: number;
  deadline: string;
  monthlyIncome: number;
}) => {
  const cacheKey = `goal_${goalData.name}_${goalData.targetAmount}`;
  const cachedAnalysis = localStorage.getItem(cacheKey);

  if (cachedAnalysis) {
    return JSON.parse(cachedAnalysis);
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${(import.meta as any).env.VITE_OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: `Ти си финансов съветник за тийнейджъри. Създай персонализиран план за спестяване, който да е реалистичен и постижим. 
            
            Важно е да предоставиш конкретни стъпки, които да помогнат на тийнейджъра да постигне целта си, като вземеш предвид неговия месечен доход и срока за постигане на целта.
            
            Включи:
            1. Точна месечна сума, която трябва да се спестява
            2. Подробни стъпки как да се постигне целта
            3. Алтернативни начини за увеличаване на доходите
            4. Практически съвети за намаляване на разходите
            5. Как да се проследява прогреса
            
            Отговорът трябва да е мотивиращ, реалистичен и съобразен с възрастта на потребителя.`,
          },
          {
            role: 'user',
            content: `Създай план за следната цел:
              Цел: ${goalData.name}
              Сума: ${goalData.targetAmount} лв.
              Краен срок: ${goalData.deadline}
              Месечен доход: ${goalData.monthlyIncome} лв.
              
              Върни отговора в следния JSON формат:
              {
                "mainPlan": {
                  "monthlyTarget": число (колко трябва да спестява месечно),
                  "timeline": "подробно описание на времевата рамка",
                  "steps": [
                    "Стъпка 1 с конкретни действия",
                    "Стъпка 2 с конкретни действия",
                    "Стъпка 3 с конкретни действия",
                    "Стъпка 4 с конкретни действия",
                    "Стъпка 5 с конкретни действия"
                  ]
                },
                "alternativeMethods": {
                  "suggestions": [
                    "Конкретен начин за допълнителен доход подходящ за тийнейджъри",
                    "Втори начин за допълнителен доход с примери",
                    "Трети начин за допълн
                    "Трети начин за допълнителен доход с примери",
                    "Четвърти начин за допълнителен доход с примери"
                  ],
                  "expectedResults": "Подробно описание на очакваните резултати от прилагането на тези методи"
                }
              }`,
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API Error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;

    try {
      const analysis = content ? JSON.parse(content) : null;

      if (analysis) {
        localStorage.setItem(cacheKey, JSON.stringify(analysis));
      }

      return analysis;
    } catch (parseError) {
      console.error('Error parsing AI response:', parseError);

      // Опит за извличане на JSON от текста, ако отговорът не е чист JSON
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          const extractedJson = JSON.parse(jsonMatch[0]);
          localStorage.setItem(cacheKey, JSON.stringify(extractedJson));
          return extractedJson;
        } catch (e) {
          console.error('Failed to extract JSON from response');
        }
      }

      // Резервен вариант, ако не можем да извлечем JSON
      return {
        mainPlan: {
          monthlyTarget: Math.ceil(
            goalData.targetAmount /
              getMonthsBetweenDates(new Date(), new Date(goalData.deadline)),
          ),
          timeline: `План за постигане на целта до ${new Date(
            goalData.deadline,
          ).toLocaleDateString('bg-BG')}`,
          steps: [
            'Определи точна месечна сума за спестяване',
            'Създай отделна сметка за тази цел',
            'Намали ненужните разходи',
            'Търси начини за допълнителни доходи',
            'Проследявай редовно прогреса си',
          ],
        },
        alternativeMethods: {
          suggestions: [
            'Предлагай услуги като помощ с домашни, грижа за домашни любимци или градинарство',
            'Продавай ненужни вещи онлайн',
            'Участвай в проучвания или тестване на продукти',
            'Помагай на съседи или роднини срещу заплащане',
          ],
          expectedResults:
            'С тези методи можеш да увеличиш месечния си доход с 10-30% и да постигнеш целта си по-бързо.',
        },
      };
    }
  } catch (error) {
    console.error('AI Analysis Error:', error);

    // Резервен вариант при грешка в API заявката
    return {
      mainPlan: {
        monthlyTarget: Math.ceil(
          goalData.targetAmount /
            getMonthsBetweenDates(new Date(), new Date(goalData.deadline)),
        ),
        timeline: `План за постигане на целта до ${new Date(
          goalData.deadline,
        ).toLocaleDateString('bg-BG')}`,
        steps: [
          'Определи точна месечна сума за спестяване',
          'Създай отделна сметка за тази цел',
          'Намали ненужните разходи',
          'Търси начини за допълнителни доходи',
          'Проследявай редовно прогреса си',
        ],
      },
      alternativeMethods: {
        suggestions: [
          'Предлагай услуги като помощ с домашни, грижа за домашни любимци или градинарство',
          'Продавай ненужни вещи онлайн',
          'Участвай в проучвания или тестване на продукти',
          'Помагай на съседи или роднини срещу заплащане',
        ],
        expectedResults:
          'С тези методи можеш да увеличиш месечния си доход с 10-30% и да постигнеш целта си по-бързо.',
      },
    };
  }
};

// Помощна функция за изчисляване на месеците между две дати
function getMonthsBetweenDates(startDate: Date, endDate: Date): number {
  const months =
    (endDate.getFullYear() - startDate.getFullYear()) * 12 +
    (endDate.getMonth() - startDate.getMonth());
  return months > 0 ? months : 1; // Минимум 1 месец
}
