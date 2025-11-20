import { SensorData, PlantMood } from "./types";
import { config } from './config';

// Export configured values directly
export const PLANT_THRESHOLDS = config.thresholds;

export const DEFAULT_SENSOR_DATA: SensorData = config.defaults;

// Helper to convert JSON string keys to numbers for PlantStage type compatibility
const growthThresholds: Record<number, number> = {};
Object.entries(config.growth.thresholds).forEach(([k, v]) => {
    growthThresholds[Number(k)] = v as number;
});

const stageNames: Record<number, string> = {};
Object.entries(config.growth.stageNames).forEach(([k, v]) => {
    stageNames[Number(k)] = v as string;
});

export const GROWTH_CONFIG = {
  TICK_RATE_MS: config.growth.tickRateMs,
  XP_PER_TICK: config.growth.xpPerTick,
  THRESHOLDS: growthThresholds,
  STAGE_NAMES: stageNames
};

export const MOOD_GIFS: Record<PlantMood, string> = config.moodGifs as Record<PlantMood, string>;

export const CARE_TIPS: Record<PlantMood, string> = config.careTips as Record<PlantMood, string>;

export const FALLBACK_THOUGHTS: Record<PlantMood, string[]> = config.fallbackThoughts as Record<PlantMood, string[]>;