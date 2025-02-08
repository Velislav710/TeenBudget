import { TransactionAnalysisData } from './home-types';

export const fetchOpenAIResponse = async (
  transactionData: TransactionAnalysisData,
) => {
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
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

    const data = await response.json();
    const content = data.choices[0]?.message?.content;

    return content ? JSON.parse(content) : null;
  } catch (error) {
    console.error('AI Analysis Error:', error);
    return null;
  }
};

export const fetchBudgetPlanningAI = async (planningData: {
  expectedIncome: number;
  previousCategories: Record<string, number>;
}) => {
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
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

    const data = await response.json();
    const content = data.choices[0]?.message?.content;

    return content ? JSON.parse(content) : null;
  } catch (error) {
    console.error('AI Analysis Error:', error);
    return null;
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
        Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content:
              'Ти си финансов съветник за тийнейджъри. Създай персонализиран план за спестяване, който да е реалистичен и постижим.',
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
                  "monthlyTarget": число,
                  "timeline": "срок в месеци",
                  "steps": ["3 конкретни стъпки за постигане на целта"]
                },
                "alternativeMethods": {
                  "suggestions": ["3 начина за допълнителни доходи"],
                  "expectedResults": "описание на очаквания резултат"
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
    const analysis = content ? JSON.parse(content) : null;

    if (analysis) {
      localStorage.setItem(cacheKey, JSON.stringify(analysis));
    }

    return analysis;
  } catch (error) {
    console.error('AI Analysis Error:', error);
    return null;
  }
};
