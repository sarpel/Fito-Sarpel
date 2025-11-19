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

export interface PlantState {
  mood: PlantMood;
  sensors: SensorData;
}