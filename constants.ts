import { SensorData, PlantMood } from "./types";

export const PLANT_THRESHOLDS = {
  moisture: {
    low: 30,
    high: 85,
  },
  temperature: {
    low: 15,
    high: 30,
  },
  light: {
    low: 100,
    high: 800,
  }
};

export const DEFAULT_SENSOR_DATA: SensorData = {
  moisture: 65,
  temperature: 22,
  light: 450,
};

// Using high-reliability Tenor/Giphy CDN links to prevent 403/404 errors
export const MOOD_GIFS: Record<PlantMood, string> = {
  happy: 'https://media1.tenor.com/m/t7aI11Y23wEAAAAC/neil-degrasse-tyson-cosmos.gif', // Neil deGrasse Tyson (Mind Blown)
  thirsty: 'https://media1.tenor.com/m/1y2sYvW21iAAAAAC/spongebob-water.gif', // Spongebob (I NEED IT)
  drowning: 'https://media1.tenor.com/m/aJj3qF1ZlU0AAAAC/wet-cat-shower.gif', // Miserable Wet Cat in Shower
  hot: 'https://media1.tenor.com/m/g30_o3u7e0oAAAAC/elmo-fire.gif', // Elmo Rise / Hellfire
  freezing: 'https://media1.tenor.com/m/K2i7XqWn1-UAAAAC/frozen-shining.gif', // The Shining (Frozen Jack)
  dark: 'https://media1.tenor.com/m/Jz63gSqaWcQAAAAC/spongebob-darkness.gif', // Spongebob (Advanced Darkness)
  scorched: 'https://media1.tenor.com/m/T0P4vO6tMvIAAAAC/spongebob-my-eyes.gif', // Spongebob (MY EYES!)
};

export const CARE_TIPS: Record<PlantMood, string> = {
  happy: "I'm thriving! Just keep checking my leaves for dust and rotate my pot every week for even growth.",
  thirsty: "I need a drink! Water me until it runs out the drainage holes, but don't let me sit in standing water.",
  drowning: "I can't breathe! Stop watering immediately. Ensure my pot has drainage holes and let the soil dry out.",
  hot: "It's getting steamy! Move me to a cooler spot with good air circulation, away from radiators or direct noon sun.",
  freezing: "Brrr! Move me away from drafty windows or air conditioners. I prefer temperatures above 15°C.",
  dark: "It's too gloomy here. Move me closer to a window or turn on a grow light so I can photosynthesize!",
  scorched: "I'm burning! Move me out of direct sunlight or use a sheer curtain to filter the light."
};
