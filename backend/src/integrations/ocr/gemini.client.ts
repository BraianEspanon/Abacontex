import { GoogleGenAI } from '@google/genai';

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.warn('ADVERTENCIA: GEMINI_API_KEY no está configurada en las variables de entorno.');
}

export const aiClient = new GoogleGenAI({ apiKey: apiKey ?? '' });
