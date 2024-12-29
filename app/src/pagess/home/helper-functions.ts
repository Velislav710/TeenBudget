import { TransactionAnalysisData } from './home-types';

export const fetchOpenAIResponse = async (
  transactionData: TransactionAnalysisData,
) => {
  try {
    console.log('🚀 Изпращане на данни към AI:', transactionData);
    console.log('API Key loaded:', !!import.meta.env.VITE_OPENAI_API_KEY);

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-2024-08-06',

        messages: [
          {
            role: 'system',
            content: `Ти си финансов съветник за тийнейджъри. Анализирай транзакциите и създай полезни съвети за управление на бюджета. Връщай отговора САМО в JSON формат: {
              "analysis": {
                "summary": "кратко обобщение на финансовото състояние",
                "recommendations": ["списък с 3 конкретни препоръки"],
                "savingsPotential": "процент възможни спестявания"
              }
            }`,
          },
          {
            role: 'user',
            content: `Анализирай тези финансови данни и дай препоръки:
            ${JSON.stringify(transactionData, null, 2)}`,
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API Error: ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ AI отговор получен:', data);

    const rawContent = data?.choices[0]?.message?.content;

    if (!rawContent) {
      throw new Error(
        'Failed to extract recommendations from OpenAI response.',
      );
    }

    const cleanedContent = rawContent
      .replace(/^```json([\s\S]*?)```$/, '$1')
      .replace(/^```([\s\S]*?)```$/, '$1')
      .trim();

    return cleanedContent ? JSON.parse(cleanedContent) : null;
  } catch (error) {
    console.error('❌ Грешка при AI заявката:', error);
    return null;
  }
};
