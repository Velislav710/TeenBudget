require('dotenv').config();

module.exports = ({ config }) => ({
  ...config,
  extra: {
    apiBaseUrl: process.env.VITE_API_BASE_URL || process.env.API_BASE_URL,
    openAIApiKey: process.env.VITE_OPENAI_API_KEY || process.env.OPENAI_API_KEY,
  },
});


