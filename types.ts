
export interface SensorData {
  moisture: number; // 0-100%
  temperature: number; // Celsius
  light: number; // Lux or raw value 0-1000
}

export type PlantMood = 
  | 'happy' 
  | 'thirsty' 
  | 'drowning' 
  | 'hot' 
  | 'freezing' 
  | 'dark' 
  | 'scorched'
  | 'sleeping';

export type PlantStage = 1 | 2 | 3 | 4; // 1: Seedling, 2: Sprout, 3: Mature, 4: Bloom

export interface PlantState {
  mood: PlantMood;
  sensors: SensorData;
  stage: PlantStage;
  xp: number;
}

export type WateringFrequency = 1 | 2 | 3 | 7 | 14 | 30; // Days

export interface WateringSchedule {
  day: string; // 'Monday', etc. (Used for weekly anchor)
  time: string; // 'HH:MM' 24h format
  frequencyDays: WateringFrequency; // How often to repeat
  enabled: boolean;
}

export interface SensorThresholds {
  moisture: { low: number; high: number };
  temperature: { low: number; high: number };
  light: { low: number; high: number };
}

export interface PlantSpecies {
  id: string;
  name: string;
  description: string;
  thresholds: SensorThresholds;
  idealWateringFrequencyDays: number; // e.g., 14 for cactus, 3 for fern
}
