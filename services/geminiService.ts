
import { GoogleGenAI, HarmCategory, HarmBlockThreshold, Modality } from "@google/genai";
import { SensorData, PlantMood, PlantSpecies } from "../types";
import { FALLBACK_THOUGHTS } from "../constants";

const apiKey = process.env.API_KEY;

// Initialize only if key exists to prevent crashes in development without env
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

const getRandomFallback = (mood: PlantMood): string => {
  const options = FALLBACK_THOUGHTS[mood] || FALLBACK_THOUGHTS['happy'];
  return options[Math.floor(Math.random() * options.length)];
};

// Helper to decode Base64
function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

// Helper to decode raw PCM data to AudioBuffer
async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

export const generatePlantThought = async (
  data: SensorData, 
  mood: PlantMood, 
  nickname: string,
  species?: PlantSpecies
): Promise<string> => {
  if (!ai) {
    await new Promise(resolve => setTimeout(resolve, 500));
    return getRandomFallback(mood);
  }

  const speciesContext = species 
    ? `You are a ${species.name}. Description: ${species.description}.` 
    : `You are a generic houseplant.`;

  const systemInstruction = `You are a potted plant named "${nickname}".
  ${speciesContext}
  Your current state is: ${mood}.
  Sensor Data: Moisture ${data.moisture}%, Temp ${data.temperature}C, Light ${data.light}.
  
  React to your conditions in 15 words or less. 
  Adopt a personality based on your species description (e.g., Cactus = stoic/prickly, Fern = dramatic/needy).
  
  - Happy: Compliment the human or vibe.
  - Thirsty/Drowning/Hot/Freezing/Dark/Scorched: Complain based on your personality.
  
  Be funny, dramatic, or cute. No hashtags.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: "What is your current thought?",
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.8,
        maxOutputTokens: 100,
        safetySettings: [
          { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
          { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
        ],
      }
    });

    const text = response.text?.trim();
    
    if (!text) {
      return getRandomFallback(mood);
    }
    return text;

  } catch (error: any) {
    console.error("Gemini Thought API Error:", error);
    const errorMessage = error.message || error.toString();
    if (errorMessage.includes("API_KEY") || errorMessage.includes("401")) {
      return "Invalid API Key.";
    }
    return getRandomFallback(mood);
  }
};

export const generatePlantVoice = async (text: string, voiceName: string = 'Kore'): Promise<AudioBuffer | null> => {
  if (!ai) return null;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: text }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: voiceName }, 
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    
    if (!base64Audio) {
      console.warn("No audio data received from Gemini");
      return null;
    }

    const outputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    
    const audioBuffer = await decodeAudioData(
      decode(base64Audio),
      outputAudioContext,
      24000,
      1
    );

    return audioBuffer;

  } catch (error) {
    console.error("Gemini TTS API Error:", error);
    return null;
  }
};
