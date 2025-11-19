import { GoogleGenAI } from "@google/genai";
import { SensorData, PlantMood } from "../types";

const apiKey = process.env.API_KEY;

// Initialize only if key exists to prevent crashes in development without env
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

// Fallback thoughts to ensure the UI always has content, even if API fails or filters response
const FALLBACK_THOUGHTS: Record<PlantMood, string[]> = {
  happy: ["Photosynthesizing like a boss.", "Life is good.", "Growing strong!", "So fresh, so green.", "Vibing with the universe."],
  thirsty: ["Water... please...", "I'm parched!", "So... dry...", "Need hydration stat!", "My soil is dust."],
  drowning: ["Glub glub...", "Too much water!", "I can't swim!", "My roots are soggy.", "Someone get a towel!"],
  hot: ["Is it hot in here?", "I'm wilting...", "Turn up the AC!", "Sweating sap here.", "I'm melting!"],
  freezing: ["Brrr...", "Where's my sweater?", "Frostbite incoming!", "I'm shivering!", "So cold..."],
  dark: ["Who turned out the lights?", "I need sun!", "It's too dark.", "Can't see my leaves.", "Hello darkness my old friend."],
  scorched: ["My eyes! The goggles do nothing!", "Too bright!", "I'm burning!", "Sunblock needed!", "I'm turning into toast!"]
};

const getRandomFallback = (mood: PlantMood): string => {
  const options = FALLBACK_THOUGHTS[mood] || FALLBACK_THOUGHTS['happy'];
  return options[Math.floor(Math.random() * options.length)];
};

export const generatePlantThought = async (data: SensorData, mood: PlantMood, nickname: string): Promise<string> => {
  if (!ai) {
    // Simulate a brief delay so the UI feels responsive even without an API key
    await new Promise(resolve => setTimeout(resolve, 500));
    return getRandomFallback(mood); // Return fallback if no key
  }

  const systemInstruction = `You are a potted houseplant named "${nickname}".
  Your current state is: ${mood}.
  Sensor Data: Moisture ${data.moisture}%, Temp ${data.temperature}C, Light ${data.light}.
  
  React to your conditions in 12 words or less.
  - Happy: Zen, grateful, or scientific.
  - Thirsty: Beg for water dramatically.
  - Drowning: Complain about wet feet/roots.
  - Hot: Complain about heat/wilting.
  - Freezing: Complain about cold/shivering.
  - Dark: Ask for light/sun.
  - Scorched: Complain about brightness/burn.
  
  Be funny, dramatic, or cute. No hashtags.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: "What is your current thought?",
      config: {
        systemInstruction: systemInstruction,
        temperature: 1.1, // High creativity
        maxOutputTokens: 60,
      }
    });

    const text = response.text?.trim();
    
    if (!text) {
      console.warn("Gemini returned empty text, using fallback.");
      return getRandomFallback(mood);
    }
    return text;

  } catch (error: any) {
    console.error("Gemini API Error:", error);

    // specific error handling for API Key issues to help the user
    const errorMessage = error.message || error.toString();
    if (errorMessage.includes("API_KEY") || errorMessage.includes("401")) {
      return "Invalid API Key.";
    }

    // For all other errors (quota, network, safety filter), use the fallback
    // to maintain the immersion of the app.
    return getRandomFallback(mood);
  }
};