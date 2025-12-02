import { GoogleGenAI, Type } from "@google/genai";
import { SYSTEM_INSTRUCTION } from "../constants";
import { GeneratedQuestion, TopicData } from "../types";

<<<<<<< HEAD
const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const sendMessageToGemini = async (message: string, currentTopic?: TopicData): Promise<string> => {
  try {
    let contextPrompt = "";
    if (currentTopic) {
      contextPrompt = `CURRENT CONTEXT: The user is currently viewing the page "${currentTopic.title}". Page Description: ${currentTopic.description}. Please prioritize answers relevant to this context.`;
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `${contextPrompt}\n\nUser Query: ${message}`,
=======
const apiKey = process.env.API_KEY || ''; 
const ai = new GoogleGenAI({ apiKey });

export const fileToBase64 = (file: File): Promise<string> => {
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

export const sendMessageToGemini = async (message: string, imageBase64?: string, currentTopic?: TopicData): Promise<string> => {
  try {
    let contextPrompt = "";
    if (currentTopic) {
      contextPrompt = `
      CURRENT CONTEXT: The user is currently viewing the page "${currentTopic.title}".
      Page Description: ${currentTopic.description}.
      Please prioritize answers relevant to this context.
      `;
    }

    const parts: any[] = [];
    
    // If image is provided, add it to parts
    if (imageBase64) {
      parts.push({
        inlineData: {
          mimeType: 'image/jpeg', // Assuming jpeg/png mostly
          data: imageBase64
        }
      });
    }

    // Add text prompt
    parts.push({
      text: `${contextPrompt}\n\nUser Query: ${message}`
    });

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { parts },
>>>>>>> 650212b28125bfaa8c3ba1f6db45eae4d9555322
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.3,
      },
    });
<<<<<<< HEAD

=======
    
>>>>>>> 650212b28125bfaa8c3ba1f6db45eae4d9555322
    return response.text || "عذراً، لم أستطع معالجة طلبك حالياً.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "حدث خطأ أثناء الاتصال بالمساعد الذكي. يرجى المحاولة لاحقاً.";
  }
};

<<<<<<< HEAD
export const generateQuizQuestions = async (content: string): Promise<GeneratedQuestion[]> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Generate 3 Multiple Choice Questions (MCQ) in Arabic based on this text. Text: "${content}" Ensure the output is strictly JSON.`,
=======
export const generateQuizQuestions = async (
  content: string | File, 
  count: number = 3, 
  type: 'mcq' | 'tf' = 'mcq'
): Promise<GeneratedQuestion[]> => {
  try {
    let parts: any[] = [];
    
    let typeInstruction = "Multiple Choice Questions (MCQ) with 4 options";
    if (type === 'tf') {
      typeInstruction = "True/False Questions. The options array MUST be exactly ['صح', 'خطأ']";
    }

    let prompt = `Generate ${count} ${typeInstruction} in Arabic based on this content. 
    CRITICAL: For each question, provide a short "explanation" field explaining WHY the answer is correct. 
    Ensure the output is strictly JSON.`;

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
>>>>>>> 650212b28125bfaa8c3ba1f6db45eae4d9555322
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              question: { type: Type.STRING },
<<<<<<< HEAD
              options: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              correctAnswer: { type: Type.STRING }
            }
=======
              options: { 
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              correctAnswer: { type: Type.STRING },
              explanation: { type: Type.STRING, description: "Explanation of why this is the correct answer" }
            },
            required: ["question", "options", "correctAnswer", "explanation"]
>>>>>>> 650212b28125bfaa8c3ba1f6db45eae4d9555322
          }
        }
      }
    });

    const jsonStr = response.text?.trim();
    if (!jsonStr) return [];
<<<<<<< HEAD
    
=======
>>>>>>> 650212b28125bfaa8c3ba1f6db45eae4d9555322
    return JSON.parse(jsonStr) as GeneratedQuestion[];
  } catch (error) {
    console.error("Quiz Gen Error", error);
    return [];
  }
};