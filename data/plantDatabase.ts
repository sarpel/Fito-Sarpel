
import { PlantSpecies } from "../types";
import { config } from "../plantConfig";

export const PLANT_DATABASE: PlantSpecies[] = [
  {
    id: "custom",
    name: "Custom / Generic",
    description: "Default configuration. Good for general house plants.",
    thresholds: config.thresholds,
    idealWateringFrequencyDays: 7
  },
  {
    id: "succulent",
    name: "Succulent / Cactus",
    description: "Loves dry soil and bright light. hates wet feet.",
    thresholds: {
      moisture: { low: 10, high: 40 }, // Likes it dry
      temperature: { low: 10, high: 35 }, // Tolerates heat
      light: { low: 500, high: 1000 } // Needs lots of light
    },
    idealWateringFrequencyDays: 14
  },
  {
    id: "snake_plant",
    name: "Snake Plant (Sansevieria)",
    description: "Indestructible. Thrives on neglect. Tolerates low light and drought.",
    thresholds: {
      moisture: { low: 5, high: 35 }, // Extremely drought tolerant
      temperature: { low: 13, high: 32 },
      light: { low: 50, high: 900 } // Can survive closet to full sun
    },
    idealWateringFrequencyDays: 21
  },
  {
    id: "tropical",
    name: "Tropical (Monstera/Pothos)",
    description: "Prefers consistent moisture and indirect bright light.",
    thresholds: {
      moisture: { low: 40, high: 80 },
      temperature: { low: 18, high: 30 },
      light: { low: 200, high: 700 }
    },
    idealWateringFrequencyDays: 7
  },
  {
    id: "fiddle_leaf",
    name: "Fiddle Leaf Fig",
    description: "The Diva. Needs bright filtered light, no drafts, and consistent schedule.",
    thresholds: {
      moisture: { low: 35, high: 70 }, // Dries out top inch only
      temperature: { low: 18, high: 29 }, // Hates cold drafts
      light: { low: 400, high: 900 } // Needs bright light
    },
    idealWateringFrequencyDays: 10
  },
  {
    id: "calathea",
    name: "Calathea / Prayer Plant",
    description: "Drama queen. Demands high humidity and moist soil. Leaves move at night.",
    thresholds: {
      moisture: { low: 55, high: 90 }, // Panic if dry
      temperature: { low: 18, high: 27 },
      light: { low: 100, high: 450 } // Low light, burns easily
    },
    idealWateringFrequencyDays: 4
  },
  {
    id: "fern",
    name: "Fern / Moisture Lover",
    description: "Needs high humidity and moist soil. Keep out of direct sun.",
    thresholds: {
      moisture: { low: 50, high: 90 }, // Never let dry out completely
      temperature: { low: 15, high: 26 },
      light: { low: 50, high: 400 } // Low light tolerance
    },
    idealWateringFrequencyDays: 3
  },
  {
    id: "spider_plant",
    name: "Spider Plant",
    description: "Adaptable and easy. Shoots out babies (pups). Good for hanging baskets.",
    thresholds: {
      moisture: { low: 30, high: 75 },
      temperature: { low: 13, high: 27 },
      light: { low: 200, high: 600 }
    },
    idealWateringFrequencyDays: 7
  },
  {
    id: "herb",
    name: "Herb (Basil/Mint)",
    description: "Thirsty and loves sun. Fast growing.",
    thresholds: {
      moisture: { low: 45, high: 85 },
      temperature: { low: 15, high: 28 },
      light: { low: 300, high: 900 }
    },
    idealWateringFrequencyDays: 4
  },
  {
    id: "flowering",
    name: "Flowering (Orchid/Peace Lily)",
    description: "Sensitive to environment changes. Dramatic when thirsty.",
    thresholds: {
      moisture: { low: 35, high: 75 },
      temperature: { low: 18, high: 26 },
      light: { low: 150, high: 600 }
    },
    idealWateringFrequencyDays: 7
  }
];
