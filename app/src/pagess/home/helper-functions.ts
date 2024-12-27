export const fetchOpenAIResponse = async (
  theDataYouWillPassToTheAIInTheUserPrompt: any,
) => {
  try {
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
            content: `ТВОЯТ SYSTEM ПРОМПТ`,
          },
          {
            role: 'user',
            content: `ТВОЯТ USER ПРОМПТ`,
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API Error: ${response.status}`);
    }

    const data = await response.json();
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
    console.error('Error fetching OpenAI response:', error);
    return null;
  }
};
