import { GoogleGenAI, Type } from "@google/genai";
import { SYSTEM_INSTRUCTION } from "../constants";
import { GeneratedQuestion, TopicData } from "../types";

const apiKey = process.env.API_KEY || ''; 
const ai = new GoogleGenAI({ apiKey });

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

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

export const generateQuizQuestions = async (content: string | File): Promise<GeneratedQuestion[]> => {
  try {
    let parts: any[] = [];
    let prompt = "Generate 3 Multiple Choice Questions (MCQ) in Arabic based on this content. Ensure the output is strictly JSON.";

    if (content instanceof File) {
      const base64 = await fileToBase64(content);
      parts.push({
        inlineData: {
          mimeType: content.type,
          data: base64
        }
      });
      parts.push({ text: prompt });
    } else {
      parts.push({ text: `${prompt}\n\nText: "${content}"` });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { parts },
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