import OpenAI from 'openai';

if (!process.env.OPENAI_API_KEY) {
  throw new Error('Missing OPENAI_API_KEY environment variable');
}

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const DEFAULT_CONFIG = {
  model: process.env.AGENT_MODEL || 'gpt-3.5-turbo',
  maxTokens: parseInt(process.env.MAX_TOKENS_PER_REQUEST || '500'),
  temperature: parseFloat(process.env.AGENT_TEMPERATURE || '0.7'),
};