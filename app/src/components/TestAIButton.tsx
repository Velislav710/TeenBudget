import React from 'react';
import { fetchOpenAIResponse } from '../pagess/home/helper-functions';

export const TestAIButton = () => {
  const handleTest = async () => {
    console.log('🤖 Стартиране на AI тест...');

    const testData = {
      transactions: [
        {
          type: 'income' as const,
          category: 'Джобни',
          amount: 50,
          description: 'От родители',
        },
        {
          type: 'expense' as const,
          category: 'Храна',
          amount: 15,
          description: 'Обяд',
        },
      ],
      totalBalance: 35,
    };

    const response = await fetchOpenAIResponse(testData);
    console.log('📊 Отговор от AI:', response);
  };

  return (
    <button
      onClick={handleTest}
      style={{
        padding: '10px 20px',
        backgroundColor: '#4CAF50',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
      }}
    >
      Тествай AI анализ
    </button>
  );
};
