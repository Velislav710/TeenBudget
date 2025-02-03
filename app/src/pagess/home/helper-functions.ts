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
        temperature: 0.7,
        max_tokens: 1000,
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
export const fetchBudgetPlanningAI = async (planningData) => {
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
            content: `Ти си финансов съветник за тийнейджъри. На база очаквания доход от ${planningData.expectedIncome} лв. и предишните средни разходи по категории, предложи конкретно разпределение на бюджета в следния формат:
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
                "recommendations": ["3 конкретни препоръки за оптимизиране на бюджета"]
              }
            }`,
          },
          {
            role: 'user',
            content: `Разпредели ${
              planningData.expectedIncome
            } лв. по категории, като вземеш предвид предишните средни разходи: ${JSON.stringify(
              planningData.previousCategories,
            )}`,
          },
        ],
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    return JSON.parse(data.choices[0].message.content);
  } catch (error) {
    console.error('AI Error:', error);
    return null;
  }
};

export const generateAIAnalysis = async (goalData: any) => {
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
        temperature: 0.7,
        messages: [
          {
            role: 'system',
            content:
              'Ти си финансов съветник за тийнейджъри. Създай персонализиран план за спестяване.',
          },
          {
            role: 'user',
            content: `Анализирай следната цел:
              Цел: ${goalData.name}
              Сума: ${goalData.targetAmount} лв.
              Срок: ${goalData.deadline}
              Месечен доход: ${goalData.monthlyIncome}
              
              Върни отговора в следния формат:
              {
                "mainPlan": {
                  "monthlyTarget": ${goalData.targetAmount / 6},
                  "timeline": "конкретен срок в месеци",
                  "steps": ["3 конкретни стъпки за постигане на целта"]
                },
                "alternativeMethods": {
                  "suggestions": ["3 начина за допълнителни доходи"],
                  "expectedResults": "мотивиращо описание на резултата"
                }
              }`,
          },
        ],
      }),
    });

    const data = await response.json();
    const analysis = JSON.parse(data.choices[0].message.content);

    localStorage.setItem(cacheKey, JSON.stringify(analysis));
    return analysis;
  } catch (error) {
    console.error('AI Analysis Error:', error);
    throw error;
  }
};
