import { GoogleGenAI, Type } from "@google/genai";
import { SYSTEM_INSTRUCTION } from "../constants";
import { GeneratedQuestion, TopicData } from "../types";

const apiKey = process.env.API_KEY || ''; 
const ai = new GoogleGenAI({ apiKey });

export const sendMessageToGemini = async (message: string, currentTopic?: TopicData): Promise<string> => {
  try {
    let contextPrompt = "";
    if (currentTopic) {
      contextPrompt = `
      CURRENT CONTEXT: The user is currently viewing the page "${currentTopic.title}".
      Page Description: ${currentTopic.description}.
      Please prioritize answers relevant to this context.
      `;
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `${contextPrompt}\n\nUser Query: ${message}`,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.3,
      },
    });
    
    return response.text || "عذراً، لم أستطع معالجة طلبك حالياً.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "حدث خطأ أثناء الاتصال بالمساعد الذكي. يرجى المحاولة لاحقاً.";
  }
};

export const generateQuizQuestions = async (content: string): Promise<GeneratedQuestion[]> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Generate 3 Multiple Choice Questions (MCQ) in Arabic based on this text. 
      Text: "${content}"
      Ensure the output is strictly JSON.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              question: { type: Type.STRING },
              options: { 
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              correctAnswer: { type: Type.STRING }
            }
          }
        }
      }
    });

    const jsonStr = response.text?.trim();
    if (!jsonStr) return [];
    return JSON.parse(jsonStr) as GeneratedQuestion[];
  } catch (error) {
    console.error("Quiz Gen Error", error);
    return [];
  }
};