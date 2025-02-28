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
            content: `Ти си професионален финансов анализатор за тийнейджъри. Анализирай финансовите данни и създай изключително подробен анализ на български език. Отговаряй в следния JSON формат:
            {
              "analysis": {
                "overallSummary": {
                  "mainFindings": "подробно обобщение на финансовото състояние в поне 300 думи",
                  "keyInsights": ["5 ключови извода с конкретни числа и проценти"],
                  "riskAreas": ["3 рискови области с подробно обяснение"]
                },
                "categoryAnalysis": {
                  "topCategory": "най-голяма категория разходи с подробен анализ",
                  "categoryBreakdown": [{
                    "category": "име на категория",
                    "analysis": "200 думи анализ за всяка категория",
                    "trends": "детайлни тенденции",
                    "recommendations": ["3 конкретни препоръки"]
                  }]
                },
                "behavioralInsights": {
                  "spendingPatterns": "подробен анализ на моделите на харчене в 200 думи",
                  "emotionalTriggers": ["5 емоционални тригера за харчене"],
                  "socialFactors": "влияние на социалната среда върху харченето"
                },
                "detailedRecommendations": {
                  "immediate": ["5 спешни действия с обяснение"],
                  "shortTerm": ["5 краткосрочни препоръки"],
                  "longTerm": ["5 дългосрочни стратегии"]
                },
                "educationalGuidance": {
                  "financialLiteracy": "200 думи образователни насоки",
                  "practicalSkills": ["5 практически умения за развиване"],
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
    console.log('unescapedData: ', unescapedData);
    return unescapedData;
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
