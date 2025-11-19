import { GoogleGenAI } from "@google/genai";
import { SensorData, PlantMood } from "../types";

const apiKey = process.env.API_KEY;

// Initialize only if key exists to prevent crashes in development without env
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export const generatePlantThought = async (data: SensorData, mood: PlantMood): Promise<string> => {
  if (!ai) {
    return "I need an API_KEY to think! (Check metadata.json)";
  }

  const model = "gemini-2.5-flash";
  
  const prompt = `
    You are a potted houseplant with a distinct personality. 
    Your current internal state is: ${mood.toUpperCase()}.
    
    Sensor Readings:
    - Soil Moisture: ${data.moisture}% (Low is dry, High is wet)
    - Temperature: ${data.temperature}°C
    - Light: ${data.light} (Low is dark, High is bright)

    Based on this, write a VERY SHORT internal thought (max 12 words).
    Be expressive. If thirsty, beg for water. If hot, complain. If happy, be zen or cheeky.
    Do not use hashtags. Do not prefix with "Thought:". Just the sentence.
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        temperature: 0.8, // Creative but relevant
        maxOutputTokens: 30,
      }
    });

    return response.text?.trim() || "Photosynthesizing...";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Connection to the mycelium network lost...";
  }
};