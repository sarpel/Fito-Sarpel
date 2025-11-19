import { SensorData } from "./types";

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