export const config = {
  thresholds: {
    moisture: { low: 30, high: 85 },
    temperature: { low: 15, high: 30 },
    light: { low: 100, high: 800 }
  },
  defaults: {
    moisture: 65,
    temperature: 22,
    light: 450
  },
  growth: {
    tickRateMs: 3000,
    xpPerTick: 5,
    thresholds: {
      1: 0,
      2: 30,
      3: 100,
      4: 250
    },
    stageNames: {
      1: "Seedling",
      2: "Sprout",
      3: "Mature",
      4: "In Bloom"
    }
  },
  moodGifs: {
    happy: "https://media1.tenor.com/m/t7aI11Y23wEAAAAC/neil-degrasse-tyson-cosmos.gif",
    thirsty: "https://media1.tenor.com/m/1y2sYvW21iAAAAAC/spongebob-water.gif",
    drowning: "https://media1.tenor.com/m/aJj3qF1ZlU0AAAAC/wet-cat-shower.gif",
    hot: "https://media1.tenor.com/m/g30_o3u7e0oAAAAC/elmo-fire.gif",
    freezing: "https://media1.tenor.com/m/K2i7XqWn1-UAAAAC/frozen-shining.gif",
    dark: "https://media1.tenor.com/m/Jz63gSqaWcQAAAAC/spongebob-darkness.gif",
    scorched: "https://media1.tenor.com/m/T0P4vO6tMvIAAAAC/spongebob-my-eyes.gif"
  },
  careTips: {
    happy: "I'm thriving! Just keep checking my leaves for dust and rotate my pot every week for even growth.",
    thirsty: "I need a drink! Water me until it runs out the drainage holes, but don't let me sit in standing water.",
    drowning: "I can't breathe! Stop watering immediately. Ensure my pot has drainage holes and let the soil dry out.",
    hot: "It's getting steamy! Move me to a cooler spot with good air circulation, away from radiators or direct noon sun.",
    freezing: "Brrr! Move me away from drafty windows or air conditioners. I prefer temperatures above 15°C.",
    dark: "It's too gloomy here. Move me closer to a window or turn on a grow light so I can photosynthesize!",
    scorched: "I'm burning! Move me out of direct sunlight or use a sheer curtain to filter the light."
  },
  fallbackThoughts: {
    happy: [
      "You're doing amazing sweetie!",
      "Don't forget to smile today.",
      "You radiate good energy.",
      "I'm happy because you're here.",
      "Take a deep breath. Relax.",
      "You make my leaves flutter.",
      "Today is going to be great.",
      "You are capable of amazing things."
    ],
    thirsty: ["Water... please...", "I'm parched!", "So... dry...", "Need hydration stat!", "My soil is dust."],
    drowning: ["Glub glub...", "Too much water!", "I can't swim!", "My roots are soggy.", "Someone get a towel!"],
    hot: ["Is it hot in here?", "I'm wilting...", "Turn up the AC!", "Sweating sap here.", "I'm melting!"],
    freezing: ["Brrr...", "Where's my sweater?", "Frostbite incoming!", "I'm shivering!", "So cold..."],
    dark: ["Who turned out the lights?", "I need sun!", "It's too dark.", "Can't see my leaves.", "Hello darkness my old friend."],
    scorched: ["My eyes! The goggles do nothing!", "Too bright!", "I'm burning!", "Sunblock needed!", "I'm turning into toast!"]
  }
};