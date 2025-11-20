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
  | 'scorched';

export type PlantStage = 1 | 2 | 3 | 4; // 1: Seedling, 2: Sprout, 3: Mature, 4: Bloom

export interface PlantState {
  mood: PlantMood;
  sensors: SensorData;
  stage: PlantStage;
  xp: number;
}